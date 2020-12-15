import { parse } from '@babel/parser';
import { traverse } from '@babel/traverse';
import { generate } from '@babel/generator';
import * as t from '@babel/types';

export function parseSourceCode(
  routePath: string, sourceCode: string
): { [env: string]: { [path: string]: { code: string, map: string } } } {
  let importNodes = [];
  let identifierMap: { [key: string]: string } = {
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

        // Scan for the special importion.
        if (node.source.value === 'nickelcat') {
          for (const { type, imported, local } of specifiers) {
            if (type === 'ImportSpecifier') {
              switch (imported.name) {
                case 'on':
                case 'to':
                  identifierMap[imported.name] = local.name;
                  break;
                default:
                  break;
              }
            }
          }
        }
      },
      ExportNamedDeclaration({ node }) {
        if (t.isVariableDeclaration(node.declaration, {
          declarations: [
            t.variableDeclarator(t.function())
          ]
        })) {
          traverse(node.declaration.declarations[0].init.body.body, {

          });
        }
      }
    }
  }
}

