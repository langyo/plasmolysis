import { PluginObj } from '@babel/core';

import { parseSpecialExpression } from './utils/specialExpressionPraser';
import { importDeclarationExtract } from './utils/importDeclarationFilter';

export default function (): PluginObj {
  return {
    name: 'nickelcat-demo',
    visitor: {
      Program(globalPath, state) {
        // Parse the sentences like '$$.xxx.xxx().xxx()`
        const specialExpressions = parseSpecialExpression(globalPath);

        // Clean the ununsed libraries' reference for all the output files.
        // importDeclarationExtract(, state);
      },
    },
  };
}
