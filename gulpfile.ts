import { src, dest, series, parallel, watch as watchFiles } from 'gulp';
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
import babel = require('gulp-babel');
import del = require('del');

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

const compile = () => src([
  './packages/**/*.js',
  '!./packages/**/node_modules/**/*',
  '!./packages/create-app/templates/**/*'
])
  .pipe(babel({
    "presets": [
      [
        "@babel/preset-env"
      ],
      [
        "@babel/preset-react"
      ]
    ],
    "plugins": [
      [
        "@babel/plugin-proposal-class-properties",
        {
          "loose": true
        }
      ],
      [
        "@babel/plugin-transform-runtime"
      ]
    ]
  }))
  .pipe(dest('./dist/'));

export const link = async () => {
  for (const pkg of (await readdir(resolve('./dist')))) {
    if (await access(resolve(`./packages/${pkg}/package.json`))) {
      if (await access(resolve(`./dist/${pkg}/package.json`))) await unlink(`./dist/${pkg}/package.json`);
      await symlink(resolve(`./packages/${pkg}/package.json`), resolve(`./dist/${pkg}/package.json`));
    }
  }

  for (const pkg of (await readdir(resolve('./dist')))) {
    if (await access(resolve(`./packages/${pkg}/node_modules`))) {
      if (await access(resolve(`./dist/${pkg}/node_modules`))) await unlink(`./dist/${pkg}/node_modules`);
      await symlink(resolve(`./packages/${pkg}/node_modules`), resolve(`./dist/${pkg}/node_modules`), 'dir');
    }
  }

  for (const pkg of (await readdir(resolve('./packages')))) {
    const pkgInfo = JSON.parse(await readFile(resolve(`./packages/${pkg}/package.json`)));
    const deps = pkgInfo.dependencies ? Object.keys(pkgInfo.dependencies).reduce((list, str) => {
      if (str === 'nickelcat') return [...list, { insideName: 'core', name: 'nickelcat' }];
      if (/^nickelcat/.test(str)) return [...list, { insideName: str.substr(10), name: str }];
      return list;
    }, []) : [];
    for (const { insideName, name } of deps) {
      if (await access(resolve(`./packages/${pkg}/node_modules/${name}`))) {
        if ((await stat(resolve(`./packages/${pkg}/node_modules/${name}`))).isDirectory())
          await rmdir(resolve(`./packages/${pkg}/node_modules/${name}`), { recursive: true });
        else await unlink(`./packages/${pkg}/node_modules/${name}`);
      }
      await symlink(resolve(`./dist/${insideName}/`), resolve(`./packages/${pkg}/node_modules/${name}`), 'dir');
    }
  }
};

export const build = series(clean, compile, link);

export const build_pub_ver = series(
  build,
  async () => {
    for (const pkg of (await readdir(resolve('./dist')))) {
      if (await access(resolve(`./dist/${pkg}/package.json`))) {
        await unlink(resolve(`./dist/${pkg}/package.json`));
        await writeFile(resolve(`./dist/${pkg}/package.json`), await readFile(resolve(`./packages/${pkg}/package.json`)));
      }
    }
    for (const pkg of (await readdir(resolve('./dist')))) {
      if (await access(resolve(`./dist/${pkg}/node_modules`)))
        await unlink(resolve(`./dist/${pkg}/node_modules`));
    }
  },
  async () => {
    const { version } = JSON.parse(await readFile(resolve('./lerna.json')));
    let pkgs = {};
    for (const pkg of (await readdir(resolve('./dist')))) {
      if (await access(resolve(`./dist/${pkg}/package.json`))) {
        pkgs[pkg] = JSON.parse(await readFile(resolve(`./dist/${pkg}/package.json`)));
      }
    }
    for (const pkg of Object.keys(pkgs)) {
      pkgs[pkg].version = version;
      for (const ownPkg of Object.keys(pkgs)) {
        if (pkgs[pkg].dependencies && pkgs[pkg].dependencies[pkgs[ownPkg].name]) pkgs[pkg].dependencies[pkgs[ownPkg].name] = `^${version}`;
        if (pkgs[pkg].devDependencies && pkgs[pkg].devDependencies[pkgs[ownPkg].name]) pkgs[pkg].devDependencies[pkgs[ownPkg].name] = `^${version}`;
      }
      await writeFile(resolve(`./dist/${pkg}/package.json`), JSON.stringify(pkgs[pkg]));
    }
  }
);

export const watch = series(build, () => watchFiles(['./**/*', '!./**/node_modules/**/*', '!./dist/**/*'], compile));
