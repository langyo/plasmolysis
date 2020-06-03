import { src, dest, series, parallel, symlink, watch } from 'gulp';
import babel from 'gulp-babel';
import del from 'del';

const clean = () => del('./dist/');
export { clean };

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

const copy_packages_json = () => src([
  './packages/**/package.json',
  '!./packages/**/node_modules/**/package.json'
]).pipe(dest('./dist/'));

export const build = series(clean, compile, copy_packages_json);

export const debug_link = series(
  compile,
  () => {
    return src([
      './packages/*/node_modules/'
    ]).pipe(symlink('./dist/'));
  }
);

export const debug_link_watch = () => watch(['./**/*', '!./**/node_modules/**/*', '!./dist/**/*'], parallel(compile, copy_packages_json));
