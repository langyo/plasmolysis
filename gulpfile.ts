import {
  src, dest, series, watch as watchFiles, parallel
} from 'gulp';
import {
  symlink,
  access,
  unlink,
  readFile,
  writeFile,
  stat,
  rmdir
} from 'promisely-fs';
import { resolve } from 'path';
import { spawn } from 'child_process';
import * as inquirer from 'inquirer';
import * as jsonFormatStringify from 'json-stringify-nice';

import * as ts from 'gulp-typescript';
import * as del from 'del';
import * as merge from 'merge2';

const packageNames = [
  'action-preset',
  'action-routes',
  'core',
  'create-app',
  'dev-server'
];
const linkPackageNames = [
  'action-preset',
  'action-routes',
  'core'
]

export const clean = series.apply(undefined, packageNames.map(
  name => () => del(`./packages/${name}/dist`))
);

export const compile = series.apply(undefined,
  packageNames.map(name => () => {
    let { dts, js } = src([
      `./packages/${name}/src/**/*.ts`,
      '!./packages/**/node_modules/**/*'
    ])
      .pipe(ts({
        declaration: true,
        sourceMap: true
      }));
    return merge([
      dts.pipe(dest(`./packages/${name}/dist`)),
      js.pipe(dest(`./packages/${name}/dist`))
    ]);
  }));

export const install = process.env.CI ?
  series.apply(undefined, packageNames.map(name => () => spawn(
    process.platform === 'win32' ? `npm.cmd` : 'npm', ['install'], {
    stdio: 'inherit',
    cwd: resolve(`./packages/${name}`)
  }))) : series.apply(undefined, packageNames.map(name => () => spawn(
    process.platform === 'win32' ? `yarn.cmd` : 'yarn', [], {
    stdio: 'inherit',
    cwd: resolve(`./packages/${name}`)
  })));

export const link = async () => {
  // Scan all the packages and get the packages' names.
  let deps: { [key: string]: string } = {};
  for (const pkg of linkPackageNames) {
    if (await access(resolve(`./packages/${pkg}/package.json`))) {
      deps[JSON.parse(
        await readFile(resolve(`./packages/${pkg}/package.json`), 'utf8')
      ).name] = pkg;
    }
  }

  // Create symlinks.
  for (const pkg of packageNames) {
    // Link 'package.json'.
    if (await access(resolve(`./packages/${pkg}/package.json`))) {
      if (await access(resolve(`./packages/${pkg}/dist/package.json`))) {
        await unlink(`./packages/${pkg}/dist/package.json`);
      }
      if (await access(resolve(`./packages/${pkg}/dist`))) {
        await symlink(
          resolve(`./packages/${pkg}/package.json`),
          resolve(`./packages/${pkg}/dist/package.json`)
        );
      }
    }

    // Link 'node_modules' folder to the 'dist' folder.
    if (await access(resolve(`./packages/${pkg}/node_modules`))) {
      if (await access(resolve(`./packages/${pkg}/dist/node_modules`))) {
        await unlink(`./packages/${pkg}/dist/node_modules`);
      }
      if (await access(resolve(`./packages/${pkg}/dist`))) {
        await symlink(
          resolve(`./packages/${pkg}/node_modules`),
          resolve(`./packages/${pkg}/dist/node_modules`),
          'dir'
        );
      }
    }

    // Link local packages to every 'node_modules' folders.
    if (await access(resolve(`./packages/${pkg}/package.json`))) {
      const { peerDependencies } = JSON.parse(
        await readFile(resolve(`./packages/${pkg}/package.json`), 'utf8')
      );
      for (const peerDep of Object.keys(peerDependencies)) {
        if (
          await access(resolve(`./packages/${deps[peerDep]}/node_modules`)) &&
          await access(resolve(`./packages/${pkg}/node_modules`))
        ) {
          if (
            await access(resolve(`./packages/${pkg}/node_modules/${peerDep}`))
          ) {
            if ((
              await stat(resolve(`./packages/${pkg}/node_modules/${peerDep}`))
            ).isSymbolicLink()) {
              await unlink(
                resolve(`./packages/${pkg}/node_modules/${peerDep}`)
              );
            } else if ((
              await stat(resolve(`./packages/${pkg}/node_modules/${peerDep}`))
            ).isDirectory()) {
              await rmdir(
                resolve(`./packages/${pkg}/node_modules/${peerDep}`),
                { recursive: true }
              );
            }
          }
          await symlink(
            resolve(`./packages/${deps[peerDep]}/dist`),
            resolve(`./packages/${pkg}/node_modules/${peerDep}`),
            'dir'
          );
        }
      }
    }
  }
};

export const debugGlobalLink = series.apply(undefined,
  packageNames.map(name => () => spawn(
    process.platform === 'win32' ? `yarn.cmd` : 'yarn', ['link'], {
    stdio: 'inherit',
    cwd: resolve(`./packages/${name}/dist`)
  })));

export const build = series(clean, compile, link);

export const publish = series(
  clean, compile,

  // Check and rewrite the local dependencies' version.
  async () => {
    const [major, minor, patch]: [number, number, number]
      = JSON.parse(
        await readFile(resolve(`./package.json`), 'utf8')
      ).version.split('.').map((n: string) => +n);
    const { version } = await inquirer.prompt([
      {
        type: 'list',
        name: 'version',
        message: 'Choose version:',
        choices: [
          `${major}.${minor}.${patch + 1}`,
          `${major}.${minor + 1}.${0}`,
          `${major + 1}.${0}.${0}`
        ]
      }
    ]);

    await writeFile(
      resolve(`./package.json`),
      (await readFile(
        resolve(`./package.json`), 'utf8'
      )).replace(/"version" *: *".+?"/, `"version": "${version}"`)
    );

    for (const pkg of packageNames) {
      if (await access(resolve(`./packages/${pkg}/package.json`))) {
        let cfg = JSON.parse(await readFile(resolve(`./packages/${pkg}/package.json`), 'utf8'));
        cfg.version = version;
        for (const depName of packageNames) {
          if (await access(resolve(`./packages/${depName}/package.json`))) {
            const { name } = JSON.parse(await readFile(
              resolve(`./packages/${depName}/package.json`), 'utf8'
            ));
            if (
              typeof cfg.peerDependencies !== 'undefined' &&
              typeof cfg.peerDependencies[name] !== 'undefined'
            ) {
              cfg.peerDependencies[name] = version;
            }
          }
        }

        const ord = [
          'name', 'description', 'author', 'license', 'version', 'scripts',
          'dependencies', 'devDependencies', 'peerDependencies'
        ];
        // Write to the source file first.
        await writeFile(
          resolve(`./packages/${pkg}/package.json`),
          jsonFormatStringify(cfg, ord)
        );
        // Rewrite the main tag.
        cfg.main = './index.js';
        await writeFile(
          resolve(`./packages/${pkg}/dist/package.json`),
          jsonFormatStringify(cfg, ord)
        );
      }
    }

    // Create a version tag.
    return spawn(
      'git',
      ['tag', '-a', `v${version}`, '-m', `v${version}`],
      { stdio: 'inherit', cwd: process.cwd() }
    );
  },

  // Push all the tags to the remote.
  () => spawn(
    'git',
    ['push', '--tags'],
    { stdio: 'inherit', cwd: process.cwd() }
  ),

  // Publish the packages by using NPM.
  series.apply(undefined, packageNames.map(name => () => spawn(
    process.platform === 'win32' ? `npm.cmd` : 'npm', ['publish'], {
    stdio: 'inherit',
    cwd: resolve(`./packages/${name}/dist/`)
  })))
);

export const watch = series(
  build,
  parallel.apply(undefined,
    packageNames.map(name => () => watchFiles([
      `./packages/${name}/**/*`,
      `!./packages/${name}/dist/**/*`,
      `!./packages/${name}/node_modules/**/*`
    ], () => {
      let { dts, js } = src([
        `./packages/${name}/src/**/*.ts`,
        '!./packages/**/node_modules/**/*'
      ])
        .pipe(ts({
          declaration: true,
          sourceMap: true
        }));
      return merge([
        dts.pipe(dest(`./packages/${name}/dist`)),
        js.pipe(dest(`./packages/${name}/dist`))
      ]);
    }))));
