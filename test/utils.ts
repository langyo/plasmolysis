import { transform } from '@babel/core';
import { join } from 'path';

export function babelCompiler(codeFrame: string) {
  return transform(codeFrame, {
    filename: 'test.ts',
    ast: true,
    sourceMaps: true,
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      join(__dirname, '../../dist/export.js'),
    ],
  });
}
