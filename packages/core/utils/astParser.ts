import { Parser } from 'acorn';
import * as JSXPlugin from 'acorn-jsx';

const parser = Parser.extend(JSXPlugin());

function removeLocationInfo(node: Node): Node {
  return Object.keys(node).filter(
    key => ['start', 'end'].indexOf(key) < 0
  ).reduce((obj, key) => ({
    ...obj,
    [key]: Array.isArray(node[key])
      ? node[key]
        .filter((n: Node) => typeof n !== 'undefined')
        .map((n: Node) => removeLocationInfo(n))
      : node[key] && typeof node[key] === 'object'
        ? removeLocationInfo(node[key])
        : node[key]
  }), {} as Node);
}

export function parse(code: string): Node {
  return removeLocationInfo(parser.parse(code, {
    ecmaVersion: 'latest', sourceType: 'module'
  }) as unknown as Node);
}
