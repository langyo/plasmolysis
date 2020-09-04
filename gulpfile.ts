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
    './packages/**/*.ts',
    '!./packages/**/node_modules/**/*',
    '!./packages/create-app/templates/**/*'
  ])
    .pipe(ts({
      declaration: true,
      sourceMap: true
    }));
  return merge([
    dts.pipe(dest('./dist/')),
    js.pipe(dest('./dist/'))
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

export const debugGlobalLink = createChildProcesses('yarn', ['link'], [
  resolve('./dist/action-preset'),
  resolve('./dist/action-routes'),
  resolve('./dist/core'),
  resolve('./dist/create-app'),
  resolve('./dist/dev-server')
]);

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
    let rootPkg = JSON.parse(
      await readFile(resolve(`./package.json`), { encoding: 'utf8' })
    );
    const [major, minor, patch]: [number, number, number]
      = rootPkg.version.split('.').map((n: string) => +n);
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

    rootPkg.version = version
    await writeFile(
      resolve(`./package.json`),
      JSON.stringify(rootPkg)
    );

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

      // Create a version tag.
      return spawn(
        'git',
        ['tag', '-a', `v${major}.${minor}.${patch}`, '-m', `v${major}.${minor}.${patch}`],
        { stdio: 'inherit', cwd: process.cwd() }
      );
    }
  },

  // Push all the tags to the remote.
  () => spawn(
    process.platform === 'win32' ? `git.cmd` : 'git',
    ['push', '--tags'],
    { stdio: 'inherit', cwd: process.cwd() }
  ),

  // Publish the packages by using NPM.
  series(createChildProcesses('npm', ['publish'], [
    resolve('./dist/action-preset'),
    resolve('./dist/action-routes'),
    resolve('./dist/core'),
    resolve('./dist/create-app'),
    resolve('./dist/dev-server')
  ]))
);

export const watch = series(
  build,
  () => watchFiles(
    ['./**/*', '!./**/node_modules/**/*', '!./dist/**/*'],
    compile
  )
);
