import {
  src, dest, series, watch as watchFiles, parallel
} from 'gulp';
import {
  existsSync as exists,
  readFileSync as readFile,
  writeFileSync as writeFile,
} from 'fs';
import { resolve } from 'path';
import { spawn } from 'child_process';
import * as ts from 'gulp-typescript';

export const install = process.env.CI ?
  series() : series();

export const build = series();
