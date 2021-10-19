import { transform } from '@babel/core';
import { Node } from '@babel/types';
import { join } from 'path';

export function compile(codeFrame: string, enablePlugin: boolean) {
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
      ...(enablePlugin ? [join(__dirname, '../dist/export.js')] : []),
    ],
  });
}

export interface IPosition {
  start: number;
  end: number;
  loc: {
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
  };
}

export function compare(leftCode: string, rightCode: string): boolean {
  const leftNode = compile(leftCode, false).ast.program;
  const rightNode = compile(rightCode, true).ast.program;
  console.debug(leftNode, rightNode);

  const errPosList: {
    left: IPosition;
    right: IPosition;
  }[] = [];

  function dfs(left: Node, right: Node): boolean {
    function pushErrPos() {
      errPosList.push({
        left: { start: left.start, end: left.end, loc: left.loc },
        right: { start: right.start, end: right.end, loc: right.loc },
      });
    }

    // TODO - I don't know what happened that lead to the stack overflow...
    for (const key of Object.keys(left).filter(
      (key: string) => ['start', 'end', 'loc'].indexOf(key) < 0
    )) {
      if (Array.isArray(left[key])) {
        if (!Array.isArray(right[key])) {
          pushErrPos();
          return false;
        }
        if (left[key].length !== right[key].length) {
          pushErrPos();
          return false;
        }
        for (let n = 0; n < left[key].length; ++n) {
          if (!dfs(left[key][n], right[key][n])) {
            pushErrPos();
            return false;
          }
        }
      } else if (
        typeof left[key] !== typeof right[key] ||
        (typeof left[key] !== 'object' && left[key] !== right[key]) ||
        !dfs(left[key], right[key])
      ) {
        pushErrPos();
        return false;
      }
    }
    return true;
  }

  console.debug('Error position list:', errPosList);
  return dfs(leftNode, rightNode);
}
