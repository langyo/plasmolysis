import { transform } from '@babel/core';
import { join } from 'path';

describe('Generate remote hybrid', () => {
  test('Test', () => {
    const codeFrame = `
let test = 123;
`;
    const { code, map, ast } = transform(codeFrame, {
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
    console.log('------ Code ------');
    console.log(code);
    console.log('------ Map ------');
    console.log(map);
    console.log('------ AST -------');
    console.log(ast);

    expect(true).toBeTruthy();
  });
});
