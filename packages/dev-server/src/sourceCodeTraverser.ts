import { IEnv, IProtocol, envMap, protocolMap } from './index';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import template from '@babel/template';
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
  libs: string[]
): ISourceMap {
  let ret: ISourceMap = { [envTag]: {} };
  let libToPropMap: string[] = [];

  traverse(parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  }), {
    ImportDeclaration(path) {

    },
    ExportNamedDeclaration(path) {

    },
    JSXElement(path) {
    }
  });

  return ret;
}
