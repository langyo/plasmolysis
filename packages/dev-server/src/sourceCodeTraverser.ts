import { IEnv } from './index';
import { parse } from '@babel/parser';
import { traverse } from '@babel/traverse';
import { generate } from '@babel/generator';
import * as t from '@babel/types';

export function parseSourceCode(
  envTag: IEnv, routePath: string, sourceCode: string
): { [env: string]: { [path: string]: { code: string, map: string } } } {
  let importNodes: string[] = [];
  let importSpecSet: string[] = [];
  let specActionMap = {
    on: 'on',
    to: 'to'
  };

  traverse(
    parse(sourceCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    }), {
      ImportDeclaration({ node }) {
        importNodes.push(node);

        if (isActionPackage(node.source.value)) {
          traverse(node, {
            ImportSpecifier({ node }) {
              importSpecSet.push(node.local.value);
            } // TODO - Will support the other way.
          });

          if (node.source.value === 'nickelcat-action-preset') {
            traverse(node, {
              ImportSpecifier({ node }) {
                switch(node.imported.value) {
                  case 'on':
                    specActionMap.on = node.local.value;
                    break;
                  case 'to':
                    specActionMap.to = node.local.value;
                    break;
                  default:
                    break;
                }
              }
            });
          }
        }
      },
      ExportNamedDeclaration({ node, remove }) {
        if (
          t.isVariableDeclaration(node.declaration) &&
          t.isCallExpression(node.declaration.declarations[0])
        ) {
          if (t.isStringLiteral(node.declaration.declarations[0].callee, {
            value: specActionMap.on
          })) {
            if (t.isStringLiteral(
              node.declaration.declarations[0].arguments[0]
            )) {
              if (
                node.declaration.declarations[0].arguments[0].value === envTag
              ) {
                node.declaration.declarations[0].replaceWith(
                  t.asyncFunction();
                );
              } else {
                remove();
              }
            } else {
              throw node.declaration.declarations[0].buildFrameError(
                'The first argument must be a string.'
              );
            }
          }
        }
      }
    }
  }
}

