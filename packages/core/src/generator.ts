import { Node, Program, Statement, Identifier } from 'estree';
import { parse } from '../utils/astParser';

export const transform = (code: string, platform: string): Node => {
  const ast: Program = parse(code) as any;
  console.log('old ast', ast)

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
          node.body.body = node.body.body.map(node => {
            // TODO - Needs to get all the variants that be used in the scope.
            //        We will compare the variants' usage between the outer
            //        scope and the inner scope.
            switch (node.type) {
              case 'ExpressionStatement':
                if (
                  node.expression.type === 'Literal' &&
                  node.expression.raw.substr(0, 3) === 'on '
                ) {
                  currentPlatform = node.expression.raw.substr(3);
                }
                return node;
              default:
                if (currentPlatform !== platform) {
                  return undefined;
                } else {
                  return dfs(node) as Statement;
                }
            }
          }).filter(node => typeof node !== 'undefined');
        }
        return node;

      case 'BlockStatement':
        node.body = node.body.map(node => {
          if (
            node.type === 'ExpressionStatement' &&
            node.expression.type === 'Literal' &&
            (node.expression.value as string).substr(0, 3) === 'on '
          ) {
            currentPlatform = (node.expression.value as string).substr(3);
            return undefined;
          } else {
            return dfs(node) as Statement;
          }
        }).filter(node => typeof node !== 'undefined');
        break;
      default:
        // TODO - Traverse all possible child nodes to record variable usage.
    }
    if (currentPlatform !== platform) {
      return undefined;
    } else {
      return node;
    }
  }

  // Parse the most top scope.
  ast.body = ast.body.map(node => {
    // TODO - I needs a way to generate a tree that can describe the general
    //        relation between any function calling and closure reference.
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
          (node.expression.value as string).substr(0, 3) === 'on '
        ) {
          currentPlatform = (node.expression.value as string).substr(3);
          return undefined;
        } else {
          return dfs(node) as Statement;
        }
    }
    if (currentPlatform !== platform) {
      return undefined;
    } else {
      return node;
    }
  }).filter(node => typeof node !== 'undefined');

  console.log('new ast', ast)
  console.log('------')

  return ast;
};

