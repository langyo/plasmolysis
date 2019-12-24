// Source code URL: https://github.com/ronami/minipack

import { readFileSync } from 'fs';
import { dirname as _dirname, join } from 'path';
import { parse } from 'babylon';
import traverse from 'babel-traverse';
import { transformFromAst } from 'babel-core';

let ID = 0;

const createAsset = filename => {
  const content = readFileSync(filename, 'utf-8');
  const ast = parse(content, {
    sourceType: 'module',
  });
  const dependencies = [];
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  const id = ID++;
  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  });

  return {
    id,
    filename,
    dependencies,
    code,
  };
}

const createGraph = entry => {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];

  for (const asset of queue) {
    asset.mapping = {};
    const dirname = _dirname(asset.filename);
    asset.dependencies.forEach(relativePath => {
      const absolutePath = join(dirname, relativePath);
      const child = createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }

  return queue;
}

const bundle = graph => {
  let modules = '';

  graph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];
        function localRequire(name) {
          return require(mapping[name]);
        }
        const module = { exports : {} };
        fn(localRequire, module, module.exports);
        return module.exports;
      }
      require(0);
    })({${modules}})
  `;

  return result;
}

export default src => bundle(createGraph(src));