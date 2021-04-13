import { transform } from '../src/generator';

describe('Environment filter', () => {
  test('On top, same environment', async () => {
    const source = `
      'on client';
      let i = 1;
    `;
    const target = `
      'on client';
      let i = 1;
    `;
    expect(transform(source, 'client')).toEqual(target);
  });

  test('On top, different environment', async () => {
    const source = `
      'on server';
      let i = 1;
    `;
    const target = `
      'on server';
    `;
    expect(transform(source, 'client')).toEqual(target);
  });

  test('On function, same environment', async () => {
    const source = `
      function test() {
        'on client';
        let i = 1;
      }
    `;
    const target = `
      function test() {
        'on client';
        let i = 1;
      }
    `;
    expect(transform(source, 'client')).toEqual(target);
  });

  test('On function, different environment', async () => {
    const source = `
      function test() {
        'on server';
        let i = 1;
      }
    `;
    const target = `
      function test() {
        'on server';
      }
    `;
    expect(transform(source, 'client')).toEqual(target);
  });
});

