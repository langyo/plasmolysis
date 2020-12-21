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
};

export function traverser(
  envTag: IEnv,
  sourceCode: string,
  actionList: { [path: string]: string[] }
): ISourceMap {
  let ret: ISourceMap = { [envTag]: {} };
  let actionSet: string[] = [];

  traverse(parse(sourceCode, {
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
        const args = Array(
          path.get('openingElement.attributes').length
        ).map((_v, i) => i).reduce((obj, i) => ({
          ...obj,
          [path.get(`openingElement.attributes.${i}.name`).name]:
            path.get(`openingElement.attributes.${i}.value`).isStringLiteral() ?
              path.get(`openingElement.attributes.${i}.value`).value : true
        }), {});
        const envFromExport = Object.keys(args).find(
          n => envMap.indexOf(n) >= 0
        );

        if (path.get('children.0.expression').isObjectExpression()) {
          throw path.get('children.0.expression').buildFrameError(
            `The inside must be an object.`
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
          path.replaceWith(traverse(
            path.get('children.0.expression.properties'), {
            ObjectMethod(path) {

            }
          }));
        } else {
          path.remove();
        }
      } else {
        throw path.buildFrameError('Only support the tag "on".');
      }
    }
  });

  return ret;
}
