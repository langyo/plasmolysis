import { Parser } from 'acorn';
import { Node, Statement, Identifier } from 'estree';

export const transform = (code: string, platform: string): Node => {
  const ast = Parser.extend(
    require("acorn-jsx")(),
    require("acorn-bigint")
  ).parse(code, { ecmaVersion: 'latest', sourceType: 'module' }) as Node;

  // Every closure has the platform list, which the first element in this list
  // is the current platform.
  // When the AST enter a new scope and use the variant's name again,
  // the new closure's platform will be pushed to the beginning of the array.
  // On the contrary, remove the array's first element when leave the scope.
  let closureList: { [name: string]: string[] } = {};
  let currentPlatform: string = platform;

  function dfs(node: Node) {
    switch (node.type) {
      case 'ImportDeclaration':
        for (const spec of node.specifiers) {
          closureList[spec.local.name] = closureList[spec.local.name]
            ? [currentPlatform, ...closureList[spec.local.name]]
            : closureList[spec.local.name];
        }
        break;
      case 'VariableDeclaration':
        for (const decl of node.declarations) {
          const { name } = decl.id as Identifier;
          closureList[name] = closureList[name]
            ? [currentPlatform, ...closureList[name]]
            : [currentPlatform];
        }
        break;
      case 'ArrowFunctionExpression':
      case 'FunctionDeclaration':
        if (node.body.type === 'BlockStatement') {
          // TODO - Needs platform transform middleware.
          for (let s of node.body.body) {
            if (
              s.type === 'ExpressionStatement' &&
              s.expression.type === 'Literal' &&
              s.expression.raw.substr(0, 3) === 'on '
            ) {
              currentPlatform = s.expression.raw.substr(3);
            } else if (currentPlatform !== platform) {
              s = undefined;
            } else {
              s = dfs(s) as Statement;
            }
          }
        }
        return node;

      case 'Program':
      case 'BlockStatement':
        for (let s of node.body) {
          if (
            s.type === 'ExpressionStatement' &&
            s.expression.type === 'Literal' &&
            s.expression.raw.substr(0, 3) === 'on '
          ) {
            currentPlatform = s.expression.raw.substr(3);
          } else if (currentPlatform !== platform) {
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

  return dfs(ast);
};

