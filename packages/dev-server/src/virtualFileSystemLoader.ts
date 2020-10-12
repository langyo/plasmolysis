import { join } from 'path';

import { Volume } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';

export interface INode {
  [key: string]: string | INode
};

export function vfsLoader(
  virtualFiles: { [key: string]: string },
  entryPath: string = process.cwd()
) {
  const vf = Object.keys(virtualFiles).reduce((obj, key) => ({
    ...obj,
    [join(entryPath, key)]: virtualFiles[key]
  }), {});

  const mfs = Volume.fromJSON(vf);
  let fs = (new Union()).use(realFs).use(mfs as any);
  if (typeof fs['join'] === 'undefined') {
    fs['join'] = join;
  }

  return fs;
}