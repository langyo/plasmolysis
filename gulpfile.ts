import { src, dest, series, watch as watchFiles } from 'gulp';
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
import { spawn } from 'child_process';
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

export const clean = () => del('./dist/');

const compile = () => {
  let { dts, js } = src([
    './packages/**/*.ts',
    '!./packages/**/node_modules/**/*',
    '!./packages/create-app/templates/**/*'
  ])
    .pipe(ts({ declaration: true }));
  return merge([
    dts.pipe(dest('./dist/')),
    js.pipe(dest('./dist/'))
  ]);
};

export const install = series(
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', [], {
    cwd: resolve('./packages/action-preset'),
    stdio: 'inherit'
  }),
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', [], {
    cwd: resolve('./packages/action-routes'),
    stdio: 'inherit'
  }),
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', [], {
    cwd: resolve('./packages/core'),
    stdio: 'inherit'
  }),
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', [], {
    cwd: resolve('./packages/create-app'),
    stdio: 'inherit'
  }),
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', [], {
    cwd: resolve('./packages/dev-server'),
    stdio: 'inherit'
  })
);

export const link = async () => {
  for (const pkg of (await readdir(resolve('./dist')))) {
    if (await access(resolve(`./packages/${pkg}/package.json`))) {
      if (await access(resolve(`./dist/${pkg}/package.json`))) {
        await unlink(`./dist/${pkg}/package.json`);
      }
      await symlink(
        resolve(`./packages/${pkg}/package.json`),
        resolve(`./dist/${pkg}/package.json`)
      );
    }
  }

  for (const pkg of (await readdir(resolve('./dist')))) {
    if (await access(resolve(`./packages/${pkg}/node_modules`))) {
      if (await access(resolve(`./dist/${pkg}/node_modules`))) {
        await unlink(`./dist/${pkg}/node_modules`);
      }
      await symlink(
        resolve(`./packages/${pkg}/node_modules`),
        resolve(`./dist/${pkg}/node_modules`),
        'dir'
      );
    }
  }

  for (const pkg of (await readdir(resolve('./packages')))) {
    const pkgInfo = JSON.parse(
      await readFile(resolve(`./packages/${pkg}/package.json`), { encoding: 'utf8' })
    );
    const deps = pkgInfo.dependencies ?
      Object.keys(pkgInfo.dependencies).reduce((list, str) => {
        if (str === 'nickelcat') {
          return [...list, { insideName: 'core', name: 'nickelcat' }];
        }
        if (/^nickelcat/.test(str)) {
          return [...list, { insideName: str.substr(10), name: str }];
        }
        return list;
      }, []) : [];
    for (const { insideName, name } of deps) {
      if (await access(resolve(`./packages/${pkg}/node_modules/${name}`))) {
        if (
          (await stat(resolve(`./packages/${pkg}/node_modules/${name}`)))
            .isDirectory()
        ) {
          await rmdir(
            resolve(`./packages/${pkg}/node_modules/${name}`),
            { recursive: true }
          );
        }
        else {
          await unlink(`./packages/${pkg}/node_modules/${name}`);
        }
      }
      await symlink(
        resolve(`./dist/${insideName}/`),
        resolve(`./packages/${pkg}/node_modules/${name}`),
        'dir'
      );
    }
  }
};

export const debugGlobalLink = series(
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['link'], {
    cwd: resolve('./packages/action-preset'),
    stdio: 'inherit'
  }),
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['link'], {
    cwd: resolve('./packages/action-routes'),
    stdio: 'inherit'
  }),
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['link'], {
    cwd: resolve('./packages/core'),
    stdio: 'inherit'
  }),
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['link'], {
    cwd: resolve('./packages/create-app'),
    stdio: 'inherit'
  }),
  () => spawn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['link'], {
    cwd: resolve('./packages/dev-server'),
    stdio: 'inherit'
  })
);

export const build = series(clean, compile, link);

export const publish = series(
  build,

  // Remove the dependencies' symlink.
  async () => {
    for (const pkg of (await readdir(resolve('./dist')))) {
      if (await access(resolve(`./dist/${pkg}/node_modules`))) {
        await unlink(resolve(`./dist/${pkg}/node_modules`));
      }
    }
  },

  // Check and rewrite the local dependencies' version.
  async () => {
    // TODO - Read the root 'package.json' 's 'version'.
    
    let pkgs = {};
    for (const pkg of (await readdir(resolve('./dist')))) {
      if (await access(resolve(`./dist/${pkg}/package.json`))) {
        pkgs[pkg] = JSON.parse(
          await readFile(resolve(`./dist/${pkg}/package.json`), { encoding: 'utf8' })
        );
      }
    }
    for (const pkg of Object.keys(pkgs)) {
      pkgs[pkg].version = version;
      for (const ownPkg of Object.keys(pkgs)) {
        if (
          pkgs[pkg].dependencies &&
          pkgs[pkg].dependencies[pkgs[ownPkg].name]
        ) {
          pkgs[pkg].dependencies[pkgs[ownPkg].name] = `^${version}`;
        }
        if (
          pkgs[pkg].devDependencies &&
          pkgs[pkg].devDependencies[pkgs[ownPkg].name]
        ) {
          pkgs[pkg].devDependencies[pkgs[ownPkg].name] = `^${version}`;
        }
      }
      await writeFile(
        resolve(`./dist/${pkg}/package.json`),
        JSON.stringify(pkgs[pkg])
      );
    }
  }
);

export const watch = series(
  build,
  () => watchFiles(
    ['./**/*', '!./**/node_modules/**/*', '!./dist/**/*'],
    compile
  )
);
