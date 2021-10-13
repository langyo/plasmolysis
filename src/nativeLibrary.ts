import { NodePath } from '@babel/traverse';
import { Program } from '@babel/types';

export function generateNativeSideCode(
  protocol: 'browser',
  config: any,
  methodsAST: {
    [key: string]: NodePath;
  },
  globalPath: NodePath<Program>   // Used for get the libraries' reference.
) {}
