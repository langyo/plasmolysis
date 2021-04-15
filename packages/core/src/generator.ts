import { Parser } from 'acorn';
import { Node, Program, Statement, Identifier } from 'estree';

export const transform = (code: string, platform: string): Node => {
  const ast: Program = Parser.extend(
    require("acorn-jsx")(),
    require("acorn-bigint")
  ).parse(code, { ecmaVersion: 'latest', sourceType: 'module' }) as any;

  // Every closure has the platform list, which the first element in this list
  // is the current platform.
  // When the AST enter a new scope and use the variant's name again,
  // the new closure's platform will be pushed to the beginning of the array.
  // On the contrary, remove the array's first element when leave the scope.
  let closureList: { [name: string]: string[] } = {};
  let currentPlatform: string = platform;

  function dfs(node: Node) {
    switch (node.type) {
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
          for (let stat of node.body.body) {
            switch (stat.type) {
              case 'ExpressionStatement':
                if (
                  stat.expression.type === 'Literal' &&
                  stat.expression.raw.substr(0, 3) === 'on '
                ) {
                  currentPlatform = stat.expression.raw.substr(3);
                }
                // Needs to get all the variants that be used in the scope.
                // We will compare the variants' usage between the outer scope
                // and the inner scope.
                break;
              default:
                if (currentPlatform !== platform) {
                  stat = undefined;
                } else {
                  stat = dfs(stat) as Statement;
                }
                break;
            }
          }
        }
        break;

      case 'BlockStatement':
        for (let stat of node.body) {
          if (
            stat.type === 'ExpressionStatement' &&
            stat.expression.type === 'Literal' &&
            stat.expression.raw.substr(0, 3) === 'on '
          ) {
            currentPlatform = stat.expression.raw.substr(3);
          } else if (currentPlatform !== platform) {
            stat = undefined;
          } else {
            stat = dfs(stat) as Statement;
          }
        }
        break;
      default:
        // TODO - Traverse all possible child nodes to record variable usage.
        break;
    }

    return node;
  }

  // Parse the most top scope.
  for (let node of ast.body) {
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
      case 'ExpressionStatement':
        if (
          node.expression.type === 'Literal' &&
          node.expression.raw.substr(0, 3) === 'on '
        ) {
          currentPlatform = node.expression.raw.substr(3);
        } else if (currentPlatform !== platform) {
          node = undefined;
        } else {
          node = dfs(node) as Statement;
        }
    }
  }

  return ast;
};

