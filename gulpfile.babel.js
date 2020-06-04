import { src, dest, series, parallel, symlink, watch as watchFiles } from 'gulp';
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

export const link_to_dist = () => src([
  './packages/*/node_modules'
]).pipe(symlink('./dist/'));

export const link_to_packages = () => src([
  './dist/*/node_modules/'
]).pipe(dest('./packages/*/'));

export const build = series(clean, compile, bind_packages_json, link_to_packages);

export const watch = () => watchFiles(['./**/*', '!./**/node_modules/**/*', '!./dist/**/*'], compile);
