import {
  src, dest, series, watch as watchFiles
} from 'gulp';
import {
  readdir,
  symlink,
  access,
  unlink,
  readFile,
  writeFile
} from 'promisely-fs';
import { resolve } from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as inquirer from 'inquirer';

import * as ts from 'gulp-typescript';
import * as del from 'del';
import * as merge from 'merge2';

function createChildProcesses(
  app: string,
  args: string[],
  cwd: string[]
): (() => ChildProcess)[] {
  return series.apply(
    undefined,
    cwd.map(cwd => () => spawn(
      process.platform === 'win32' ? `${app}.cmd` : app, args, {
      stdio: 'inherit', cwd
    }))
  );
}

export const clean = series(
  () => del('./packages/action-preset/dist'),
  () => del('./packages/action-routes/dist'),
  () => del('./packages/core/dist'),
  () => del('./packages/create-app/dist'),
  () => del('./packages/dev-server/dist'),
);

export const compile = async () => {
  let { dts, js } = src([
    './packages/*/src/**/*.ts',
    '!./packages/**/node_modules/**/*'
  ])
    .pipe(ts({
      declaration: true,
      sourceMap: true
    }));
  return merge([
    dts.pipe(dest('./packages/*/dist')),
    js.pipe(dest('./packages/*/dist'))
  ]);
};

export const install = process.env.CI ?
  createChildProcesses('npm', ['install'], [
    resolve('./packages/action-preset'),
    resolve('./packages/action-routes'),
    resolve('./packages/core'),
    resolve('./packages/create-app'),
    resolve('./packages/dev-server')
  ]) : createChildProcesses('yarn', [], [
    resolve('./packages/action-preset'),
    resolve('./packages/action-routes'),
    resolve('./packages/core'),
    resolve('./packages/create-app'),
    resolve('./packages/dev-server')
  ]);

export const link = async () => {
  for (const pkg of (await readdir(resolve('./packages')))) {
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
  }
};

export const debugGlobalLink = createChildProcesses('yarn', ['link'], [
  resolve('./packages/action-preset/dist'),
  resolve('./packages/action-routes/dist'),
  resolve('./packages/core/dist'),
  resolve('./packages/create-app/dist'),
  resolve('./packages/dev-server/dist')
]);

export const build = series(clean, compile, link);

export const publish = series(
  build,

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

    for (const pkg of (await readdir(resolve('./packages')))) {
      if (await access(resolve(`./packages/${pkg}/package.json`))) {
        let text = await readFile(resolve(`./packages/${pkg}/package.json`), 'utf8');
        const oldVer = JSON.parse(text).version;
        text.replace(RegExp(`"version" *: *"${oldVer}"`), `"version": "${version}"`);
        for (const depName of (await readdir(resolve('./packages')))) {
          if (await access(resolve(`./packages/${depName}/package.json`))) {
            const dep = JSON.parse(await readFile(
              resolve(`./packages/${depName}/dist/package.json`), 'utf8'
            )).name;
            text.replace(
              RegExp(`"${dep}" *: *".+?"`),
              `"${dep}": "${version}"`
            );
          }
        }
        // Write to the source file first.
        await writeFile(resolve(`./packages/${pkg}/package.json`), text);
        // Rewrite the main tag.
        text.replace(RegExp(`"main" *: *".+?" *,`), '');
        await writeFile(resolve(`./packages/${pkg}/dist/package.json`), text);
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
  series(createChildProcesses('npm', ['publish'], [
    resolve('./packages/action-preset/dist'),
    resolve('./packages/action-routes/dist'),
    resolve('./packages/core/dist'),
    resolve('./packages/create-app/dist'),
    resolve('./packages/dev-server/dist')
  ]))
);

export const watch = series(
  build,
  () => watchFiles(
    ['./**/*', '!./**/node_modules/**/*', '!./packages/*/dist/**/*'],
    compile
  )
);
