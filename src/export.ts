import BabelCore, { PluginObj } from '@babel/core';
import generate from '@babel/generator';
import { join, parse } from 'path';

export default function ({ types }: typeof BabelCore): PluginObj {
  return {
    name: 'nickelcat-demo',
    visitor: {
      Program(globalPath, state) {
        const filePath = parse(state.file.opts.filename).dir;
        globalPath.traverse({});
      },
    },
  };
}
