import { transformAsync } from '@babel/core';
import { join } from 'path';

describe('Environment filter', () => {
  test('On top, same environment', async () => {
    const source = await transformAsync(`
      'on client';
      let i = 1;
    `, {
      plugins: [
        [
          join(__dirname, '../src/babelPlugin.ts'),
          { targetEnv: 'client' }
        ]
      ],
      ast: true
    });
    const target = await transformAsync(`
      'on client';
      let i = 1;
    `, { ast: true });
    expect(source.ast).toEqual(target.ast);
  });

  test('On top, different environment', async () => {
    const source = await transformAsync(`
      'on server';
      let i = 1;
    `, {
      plugins: [
        [
          join(__dirname, '../src/babelPlugin.ts'),
          { targetEnv: 'client' }
        ]
      ],
      ast: true
    });
    const target = await transformAsync(`
      'on server';
    `, { ast: true });
    expect(source.ast).toEqual(target.ast);
  });
});

