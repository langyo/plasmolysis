import { Parser } from 'acorn';
import { Node } from 'estree';
import { transform } from '../src/generator';

function parse(code: string) {
  return Parser.extend(
    require("acorn-jsx")(),
    require("acorn-bigint")
  ).parse(code, { ecmaVersion: 'latest', sourceType: 'module' }) as Node;
}

function removeLocationInfo(node: Node | any): Node {
  if (Array.isArray(node)) {
    for (let n of node) {
      removeLocationInfo(n);
    }
  } else if (typeof node === 'object') {
    return Object.keys(node).filter(
      key => ['start', 'end'].indexOf(key) < 0
    ).reduce((obj, key) => ({
      ...obj,
      [key]: removeLocationInfo(node[key])
    }), {} as Node);
  } else {
    return node;
  }
}

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
    expect(removeLocationInfo(
      transform(source, 'client')
    )).toEqual(removeLocationInfo(parse(target)));
  });

  test('On top, different environment', async () => {
    const source = `
      'on server';
      let i = 1;
    `;
    const target = `
      'on server';
    `;
    expect(removeLocationInfo(
      transform(source, 'client')
    )).toEqual(removeLocationInfo(parse(target)));
  });

  test('On block, same environment', async () => {
    const source = `
      {
        'on client';
        let i = 1;
      }
    `;
    const target = `
      {
        'on client';
        let i = 1;
      }
    `;
    expect(removeLocationInfo(
      transform(source, 'client')
    )).toEqual(removeLocationInfo(parse(target)));
  });

  test('On block, different environment', async () => {
    const source = `
      {
        'on server';
        let i = 1;
      }
    `;
    const target = `
      {
        'on server';
      }
    `;
    expect(removeLocationInfo(
      transform(source, 'client')
    )).toEqual(removeLocationInfo(parse(target)));
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
    expect(removeLocationInfo(
      transform(source, 'client')
    )).toEqual(removeLocationInfo(parse(target)));
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
    expect(removeLocationInfo(
      transform(source, 'client')
    )).toEqual(removeLocationInfo(parse(target)));
  });
});

