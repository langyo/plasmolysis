import {
  src, dest, series, watch as watchFiles, parallel
} from 'gulp';
import {
  symlinkSync as symlink,
  existsSync as exists,
  unlinkSync as unlink,
  readFileSync as readFile,
  writeFileSync as writeFile,
  lstatSync as stat,
  rmdirSync as rmdir
} from 'fs';
import { resolve } from 'path';
import { spawn } from 'child_process';
import * as inquirer from 'inquirer';
import * as jsonFormatStringify from 'json-stringify-nice';

import * as ts from 'gulp-typescript';
import * as del from 'del';
import * as merge from 'merge2';

const packageNames = [
  'core',
  'action-preset',
  'action-routes',
  'create-app',
  'dev-server'
];
const linkPackageNames = [
  'core',
  'action-preset',
  'action-routes',
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

async function linkDepsToDist() {
  // Create symlinks from  the 'node_modules' to 'dist' folders.
  for (const pkg of packageNames) {
    // Scan all the packages and get the packages' names.
    let deps: { [key: string]: string } = {};
    for (const pkg of linkPackageNames) {
      if (exists(resolve(`./packages/${pkg}/package.json`))) {
        deps[JSON.parse(
          readFile(resolve(`./packages/${pkg}/package.json`), 'utf8')
        ).name] = pkg;
      }
    }

    // Link local packages to every 'node_modules' folders.
    if (exists(resolve(`./packages/${pkg}/package.json`))) {
      const { peerDependencies } = JSON.parse(
        readFile(resolve(`./packages/${pkg}/package.json`), 'utf8')
      );
      for (const peerDep of Object.keys(peerDependencies)) {
        if (
          exists(resolve(`./packages/${deps[peerDep]}/node_modules`)) &&
          exists(resolve(`./packages/${pkg}/node_modules`))
        ) {
          if ((
            stat(resolve(`./packages/${pkg}/node_modules/${peerDep}`))
          ).isSymbolicLink()) {
            unlink(resolve(`./packages/${pkg}/node_modules/${peerDep}`));
          }
          symlink(
            resolve(`./packages/${deps[peerDep]}/dist`),
            resolve(`./packages/${pkg}/node_modules/${peerDep}`),
            'dir'
          );
        }
      }
    }
  }
}

async function linkDepsToSrc() {
  // Create symlinks from  the 'node_modules' to 'src' folders.
  for (const pkg of packageNames) {
    // Scan all the packages and get the packages' names.
    let deps: { [key: string]: string } = {};
    for (const pkg of linkPackageNames) {
      if (exists(resolve(`./packages/${pkg}/package.json`))) {
        deps[JSON.parse(
          readFile(resolve(`./packages/${pkg}/package.json`), 'utf8')
        ).name] = pkg;
      }
    }

    // Link local packages to every 'node_modules' folders.
    if (exists(resolve(`./packages/${pkg}/package.json`))) {
      const { peerDependencies } = JSON.parse(
        readFile(resolve(`./packages/${pkg}/package.json`), 'utf8')
      );
      for (const peerDep of Object.keys(peerDependencies)) {
        if (
          exists(resolve(`./packages/${deps[peerDep]}/node_modules`)) &&
          exists(resolve(`./packages/${pkg}/node_modules`))
        ) {
          if ((
            stat(resolve(`./packages/${pkg}/node_modules/${peerDep}`))
          ).isSymbolicLink()) {
            unlink(resolve(`./packages/${pkg}/node_modules/${peerDep}`));
          }
          symlink(
            resolve(`./packages/${deps[peerDep]}/src`),
            resolve(`./packages/${pkg}/node_modules/${peerDep}`),
            'dir'
          );
        }
      }
    }
  }
}

export const link = async () => {
  // Create symlinks.
  for (const pkg of packageNames) {
    // Link 'package.json'.
    if (exists(resolve(`./packages/${pkg}/package.json`))) {
      try {
        unlink(`./packages/${pkg}/dist/package.json`);
      } catch(e) { }
      symlink(
        resolve(`./packages/${pkg}/package.json`),
        resolve(`./packages/${pkg}/dist/package.json`)
      );
    }

    // Link 'node_modules' folder to the 'dist' folder.
    if (exists(resolve(`./packages/${pkg}/node_modules`))) {
      try {
        unlink(`./packages/${pkg}/dist/node_modules`);
      } catch(e) { }
      if (exists(resolve(`./packages/${pkg}/dist`))) {
        symlink(
          resolve(`./packages/${pkg}/node_modules`),
          resolve(`./packages/${pkg}/dist/node_modules`),
          'dir'
        );
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

export const build = series(clean, linkDepsToSrc, compile, link, linkDepsToDist);

export const publish = series(
  clean, compile,

  // Check and rewrite the local dependencies' version.
  async () => {
    const [major, minor, patch]: [number, number, number]
      = JSON.parse(
        readFile(resolve(`./package.json`), 'utf8')
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

    writeFile(
      resolve(`./package.json`),
      (readFile(
        resolve(`./package.json`), 'utf8'
      )).replace(/"version" *: *".+?"/, `"version": "${version}"`)
    );

    for (const pkg of packageNames) {
      if (exists(resolve(`./packages/${pkg}/package.json`))) {
        let cfg = JSON.parse(readFile(resolve(`./packages/${pkg}/package.json`), 'utf8'));
        cfg.version = version;
        for (const depName of packageNames) {
          if (exists(resolve(`./packages/${depName}/package.json`))) {
            const { name } = JSON.parse(readFile(
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
        writeFile(
          resolve(`./packages/${pkg}/package.json`),
          jsonFormatStringify(cfg, ord)
        );
        // Rewrite the main tag.
        cfg.main = './index.js';
        writeFile(
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
