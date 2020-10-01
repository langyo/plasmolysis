import {
  src, dest, series, watch as watchFiles
} from 'gulp';
import {
  readdir as readdirOld,
  symlink as symlinkOld,
  access as accessOld,
  stat as statOld,
  unlink as unlinkOld,
  rmdir as rmdirOld,
  readFile as readFileOld,
  writeFile as writeFileOld
} from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as inquirer from 'inquirer';

import * as ts from 'gulp-typescript';
import * as del from 'del';
import * as merge from 'merge2';

const readdir = promisify(readdirOld);
const symlink = promisify(symlinkOld);
const access = async path => {
  try {
    await promisify(accessOld)(path);
    return true;
  } catch (e) {
    return false;
  }
};
const stat = promisify(statOld);
const unlink = promisify(unlinkOld);
const rmdir = promisify(rmdirOld);
const readFile = promisify(readFileOld);
const writeFile = promisify(writeFileOld);

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

export const clean = () => del('./dist/');

export const compile = () => {
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

export const install = createChildProcesses('yarn', [], [
  resolve('./packages/action-preset'),
  resolve('./packages/action-routes'),
  resolve('./packages/core'),
  resolve('./packages/create-app'),
  resolve('./packages/dev-server')
]);

export const link = async () => {
  for (const pkg of (await readdir(resolve('./dist')))) {
    if (await access(resolve(`./packages/${pkg}/src/package.json`))) {
      if (await access(resolve(`./packages/${pkg}/dist/package.json`))) {
        await unlink(`./packages/${pkg}/dist/package.json`);
      }
      await symlink(
        resolve(`./packages/${pkg}/src/package.json`),
        resolve(`./packages/${pkg}/dist/package.json`)
      );
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
        await readFile(resolve(`./package.json`), { encoding: 'utf8' })
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
        resolve(`./package.json`), { encoding: 'utf8' }
      )).replace(/"version" *: *".+?"/, `"version": "${version}"`)
    );

    let pkgs = {};
    for (const pkg of (await readdir(resolve('./packages')))) {
      if (await access(resolve(`./packages/${pkg}/dist/package.json`))) {
        const { name } = JSON.parse(
          await readFile(
            resolve(`./packages/${pkg}/dist/package.json`), { encoding: 'utf8' }
          ));
        pkgs[pkg] = name;
      }
    }
    for (const pkg of Object.keys(pkgs)) {
      let text = await readFile(
        resolve(`./packages/${pkg}/dist/package.json`), { encoding: 'utf8' }
      );
      text.replace(/"version" *: *".+?"/, `"version": "${version}"`);
      for (const depName of Object.keys(pkgs)) {
        const dep = pkgs[depName];
        text.replace(RegExp(`"${dep}" *: *".+?"`), `"${dep}": "${version}"`);
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
