import { Parser } from 'acorn';
import { Node, Statement } from 'estree';
import { generate } from 'escodegen';

export const transform = (code: string, platform: string): string => {
  const ast = Parser.extend(
    require("acorn-jsx")(),
    require("acorn-bigint")
  ).parse(code, { ecmaVersion: 'latest', sourceType: 'module' }) as Node;

  function dfs(node: Node) {
    switch (node.type) {
      case 'ArrowFunctionExpression':
      case 'FunctionDeclaration':
        if (node.body.type === 'BlockStatement') {
          // TODO - Needs platform transform middleware.
          let willRetain = true;
          for (let s of node.body.body) {
            if (
              s.type === 'ExpressionStatement' &&
              s.expression.type === 'Literal' &&
              s.expression.raw.substr(0, 3) === 'on '
            ) {
              const targetPlatform = s.expression.raw.substr(3);
              willRetain = platform === targetPlatform;
            } else if (!willRetain) {
              s = undefined;
            } else {
              s = dfs(s) as Statement;
            }
          }
        }
        return node;
      case 'Program':
      case 'BlockStatement':
        let willRetain = true;
        for (let s of node.body) {
          if (
            s.type === 'ExpressionStatement' &&
            s.expression.type === 'Literal' &&
            s.expression.raw.substr(0, 3) === 'on '
          ) {
            const targetPlatform = s.expression.raw.substr(3);
            willRetain = platform === targetPlatform;
          } else if (!willRetain) {
            s = undefined;
          } else {
            s = dfs(s) as Statement;
          }
        }
        return node;
      default:
        return node;
    }
  }

  return generate(dfs(ast));
};

