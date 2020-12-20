import { IEnv, IProtocol, envMap, protocolMap } from './index';
import { parse } from '@babel/parser';
import { traverse } from '@babel/traverse';
import { generate } from '@babel/generator';
import * as t from '@babel/types';
import { join } from 'path';

export type ISourceMap = {
  [env in IEnv]?: {
    [path: string]: { code: string; map: string; };
  };
};;

export function traverser(
  envTag: IEnv,
  routePath: string,
  sourceCode: string,
  actionList: { [path: string]: string[] }
): ISourceMap {
  let ret: ISourceMap = { [envTag]: {} };
  let actionSet: string[] = [];

  function dfs(ast: t.BlockStatement) {
    return traverse(ast, {

    });
  }

  ret[envTag][routePath] = traverse(parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  }), {
    ImportDeclaration(path) {
      if (
        Object.keys(actionList).indexOf(
          join(path.get('source').value)
        ) >= 0
      ) {
        for (const n of path.get('specifiers')) {
          if (
            actionList[join(path.get('source').value)].indexOf(
              n.get('imported').name)
          ) {
            actionSet.push(n.get('local').value);
          }
        }
      }
    },
    JSXElement(path) {
      if (path.get('openingElement.name').name === 'on') {
        const { name: envFromExport } =
          path.get('openingElement.attributes.0.name');
        if (envMap.indexOf(envFromExport) < 0) {
          path.get('openingElement.attributes.0.name').buildFrameError(
            `The environment is not support: '${envFromExport}'`
          );
        }
        if (!path.get('children.0.expression').isFunction()) {
          path.get('children.0.expression').buildFrameError(
            `The children must be a function.`
          );
        }
        traverse(path.get('children.0.expression'), {
          JSXElement(path) {
            if (path.get('openingElement.name').name === 'on') {
              throw path.get('openingElement.name').buildFrameError(
                `Not allowed to nest again within an environment declaration.`
              );
            }
          }
        });
        if (envFromExport === envTag) {
          path.replaceWith(path.get('children.0.expression.body'));
        }
      } else {
        throw path.buildFrameError('Only support the tag "on".');
      }
    },
    ExportNamedDeclaration(path) {
      let n = path.get('declaration.declrations.0.init');
      if (n.isJSXElement()) {
        if (n.get('openingElement.name').name === 'on') {
          const { name: envFromExport } =
            n.get('openingElement.attributes.0.name');
          if (envMap.indexOf(envFromExport) < 0) {
            n.get('openingElement.attributes.0.name').buildFrameError(
              `The environment is not support: '${envFromExport}'`
            );
          }
          if (!n.get('children.0.expression').isFunction()) {
            n.get('children.0.expression').buildFrameError(
              `The children must be a function.`
            );
          }
          if (envFromExport === envTag) {
            n.replaceWith(dfs(n.get('children.0.expression.body')));
          }
        } else {
          throw path.buildFrameError('Only support the tag "on".');
        }
      }
    }
  });

  return ret;
}
