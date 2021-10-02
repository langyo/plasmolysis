import { src, dest, series } from 'gulp';
import { join } from 'path';
import * as ts from 'gulp-typescript';

export const install = series(() => {});

export const build = series(() => {
  return src(join(__dirname, './src/babelPlugin.ts'))
    .pipe(
      ts({
        module: 'commonjs',
        allowSyntheticDefaultImports: true,
      })
    )
    .js.pipe(dest(join(__dirname, './dist/')));
});
