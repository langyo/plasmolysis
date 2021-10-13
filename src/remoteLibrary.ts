import { NodePath } from '@babel/traverse';
import { Program } from '@babel/types';

export function generateRemoteSideCode(
  protocol: 'http' | 'websocket' | 'hybrid',
  config: any,
  methodsAST: {
    [key: string]: NodePath;
  },
  globalPath: NodePath<Program>   // Used for get the libraries' reference.
) {}
