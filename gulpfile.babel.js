import { src, dest, series, parallel, watch as watchFiles } from 'gulp';
import { readdir, symlink, exists } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';
import babel from 'gulp-babel';
import del from 'del';

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

const bind_packages_json = () => src([
  './packages/**/package.json',
  '!./packages/**/node_modules/**/package.json'
]).pipe(symlink('./dist/'));

export const link_to_dist = async () => {
  let files = await promisify(readdir)((resolve('./packages')));
  for (let file of files) {
    if (await promisify(exists)((resolve(`./packages/${file}/node_modules`))))
      await promisify(symlink)(resolve(`./packages/${file}/node_modules`), resolve(`./dist/${file}/node_modules`));
  }
};

export const link_to_packages = () => src([
  './dist/*/node_modules/'
]).pipe(dest('./packages/*/'));

export const build = series(clean, compile, bind_packages_json, link_to_packages);

export const watch = () => watchFiles(['./**/*', '!./**/node_modules/**/*', '!./dist/**/*'], compile);
