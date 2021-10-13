import { PluginObj } from '@babel/core';
import { NodePath } from '@babel/traverse';
import { MemberExpression } from '@babel/types';

import { importDeclarationExtract } from './utils/importDeclarationFilter';

export default function (): PluginObj {
  return {
    name: 'nickelcat-demo',
    visitor: {
      Program(globalPath, state) {
        // Parse the sentences like '$$.xxx.xxx().xxx()`
        globalPath.traverse({
          Identifier: {
            enter(path, state) {
              if (path.node.name === '$$') {
                // Parse the fully tagged expression.
                if (!path.parentPath.isMemberExpression()) {
                  return;
                }

                let commands: { type: string; ast: NodePath }[] = [];
                let tempPath: NodePath<MemberExpression> = path.parentPath;
                while (
                  tempPath.parentPath.isMemberExpression() ||
                  (tempPath.parentPath.isCallExpression() &&
                    tempPath.parentPath.parentPath.isMemberExpression())
                ) {
                  if (tempPath.parentPath.isCallExpression()) {
                    tempPath = tempPath.parentPath
                      .parentPath as NodePath<MemberExpression>;
                  } else {
                    tempPath =
                      tempPath.parentPath as NodePath<MemberExpression>;
                  }

                  commands.unshift({
                    type:
                      tempPath.node.property.type === 'Identifier' &&
                      tempPath.node.property.name,
                    ast: tempPath,
                  });
                }

                console.log(
                  'Parsed:',
                  commands.map(({ type }) => type)
                );
              }
            },
            exit(path, state) {
              // Delete the tagged expression if necessary.
            },
          },
        });

        // Clean the ununsed libraries' reference for all the output files.
        // importDeclarationExtract(, state);
      },
    },
  };
}
