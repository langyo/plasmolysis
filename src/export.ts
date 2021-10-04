import BabelCore, { PluginObj } from '@babel/core';

import { importDeclarationExtract } from './utils/importDeclarationExtract';

export default function (): PluginObj {
  return {
    name: 'nickelcat-demo',
    visitor: {
      Program(globalPath, state) {
        let importDeclarationInfo = importDeclarationExtract(globalPath, state);
      },
    },
  };
}
