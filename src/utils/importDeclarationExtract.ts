import BabelCore from '@babel/core';
import { join, parse } from 'path';

type NativePlatforms = 'browser';
type RemotePlatforms = 'http' | 'websocket' | 'serverless' | 'hybrid';

interface IImportDeclaration {
  filePath: string;
  importedVariant: string;
  localVariant: string;
}

export function importDeclarationExtract(
  globalPath: BabelCore.NodePath<BabelCore.types.Program>,
  state: BabelCore.PluginPass
): {
  native: {
    [key in NativePlatforms]: IImportDeclaration[];
  };
  remote: {
    [key in RemotePlatforms]: IImportDeclaration[];
  };
} {
  const dirPath = parse(state.file.opts.filename).dir;
  const importDeclarationList: IImportDeclaration[] = [];

  globalPath.traverse({
    ImportDeclaration(path) {
      const filePath = /^\.\/.+/.test(path.node.source.value)
        ? join(dirPath, path.node.source.value)
        : path.node.source.value;
      path.traverse({
        ImportSpecifier(path) {
          importDeclarationList.push({
            filePath,
            importedVariant:
              path.node.imported.type === 'StringLiteral'
                ? path.node.imported.value
                : path.node.imported.name,
            localVariant: path.node.local.name,
          });
        },
        ImportDefaultSpecifier(path) {
          importDeclarationList.push({
            filePath,
            importedVariant: 'default',
            localVariant: path.node.local.name,
          });
        },
        ImportNamespaceSpecifier(path) {
          importDeclarationList.push({
            filePath,
            importedVariant: '', // This empty string means the whole of the namespace.
            localVariant: path.node.local.name,
          });
        },
      });
    },
  });

  return {
    native: {
      browser: [],
    },
    remote: {
      http: [],
      websocket: [],
      serverless: [],
      hybrid: [],
    },
  };
}
