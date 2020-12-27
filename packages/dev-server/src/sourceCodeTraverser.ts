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

type IEnvTagTypes = 'as' | 'on' | 'to';
const envTagTypes = ['as', 'on', 'to'];

interface IEnvTagInfo {
  type: IEnvTagTypes,
  attrs: {
    [key: string]: string | { pattern: string, flags: string }
  },
  props: {
    // There are two ways to declare the properties.
    // 1. (a, b) => { ... }
    // 2. ({ set, get }, { var1, var2 }) => { ... }
    [key: string]: string | { [imported: string]: string }
  },
  body: t.Statement[]
}

function JSXPicker(path): IEnvTagInfo {
  if (envTagTypes.indexOf(path.get('openingElement.name.name')) < 0) {
    throw path.buildFrameError(`Only allow to use the environment tags.`);
  }

  let ret: IEnvTagInfo = {
    type: path.get('openingElement.name.name'),
    attrs: {},
    props: {},
    body: []
  }

  for (const attr of path.get('openingElement.attributes')) {
    if (attr.get('value').isStringLiteral()) {
      ret.attrs[attr.get('name.name')] = attr.get('value.value');
    } else if (
      attr.get('value').isJSXExpressionContainer() &&
      attr.get('value.expression').isRegExpLiteral()
    ) {
      ret.attrs[attr.get('name.name')] = {
        pattern: attr.get('value.expression.pattern'),
        flags: attr.get('value.expression.flags')
      };
    } else {
      throw attr.buildFrameError('Only support the string/RegExp attributes.');
    }
  }

  if (typeof path.node.children === 'undefined') {
    throw path.buildFrameError('');
  }
  if (path.get('children').length > 1) {
    throw path.buildFrameError('');
  }

  return ret;
}

export function traverser(
  envTag: IEnv,
  sourceCode: string,
  methodPathMap: { [path: string]: string }
): ISourceMap {
  let ret: ISourceMap = { [envTag]: {} };
  let actionSet: string[] = [];

  traverse(parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  }), {
    JSXElement(path) {
    }
  });

  return ret;
}
