import { IActionObject } from 'nickelcat'
import { installComponent } from './frontendLoader';
import { installRoute } from './backendLoader';

export function parseActionObject(
  routePath: string, actionName: string, obj: IActionObject
) {

}

import { parse } from '@babel/parser';
import { traverse } from '@babel/traverse';
import { generate } from '@babel/generator';
import {
  Statement
} from '@babel/types';

export function parseSourceCode(
  routePath: string, sourceCode: string
) {
  const ast = parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  let importNodes = [];
  let identifierMap: {
    link: string
  } = {
    link: 'link'
  };

  for (const node of ast.program.body) {
    switch (node.type) {
      case 'ImportDeclaration':
        importNodes.push(node);

        // Scan for the special importion.
        if (node.source.value === 'nickelcat') {
          for (const { type, imported, local } of specifiers) {
            if (type === 'ImportSpecifier') {
              switch (imported.name) {
                case 'link':
                  identifierMap.link = local.name;
                  break;
                default:
                  break;
              }
            }
          }
        }
        break;
      case 'ExportNamedDeclaration':
        if (
          node.declaration.type === 'VariableDeclaration' &&
          node.declaration.declarations.length === 1 &&
          node.declaration.declarations[0].type === 'VariableDeclarator' &&
          ['FunctionExpression', 'AsyncFunctionExpression'].indexOf(
            node.declaration.declarations[0].init.type
          ) >= 0
        ) {
          node.declaration.declarations[0].init.body.body =
            parseASTAction(
              routePath,
              node.declaration.declarations[0].init.body.body,
              { importNodes, identifierMap }
            );
        } else if (
          node.declaration.type === 'FunctionDeclaration'
        ) {
          node.declaration.body.body =
            parseASTAction(
              routePath,
              node.declaration.body.body,
              { importNodes, identifierMap }
            );
        }
      default:
        break;
    }
  }
}

function parseASTAction(
  routePath: string, ast: Statement[], {
    importNodes,
    identifierMap
  }
) {
  let variants = [];
  return traverse(ast, {
    VariableDeclaration({ node }) {

    },
    CallExpression({ node }) {
      if(
        node.callee.type === 'Identifier'
      )
    }
  });
}
