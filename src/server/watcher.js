import { resolve } from 'path';
import { create } from 'watchr';
import { accessSync, writeFile } from 'fs';
import scanDir from 'klaw-sync';

import workDirPath from '../utils/workDirPath';
const distPath = resolve(__dirname, '../staticRequire.js');

const bundler = () => {
  writeFile(distPath,
    `// Unless you know what you are doing now, DON'T modify this file!
export const components = {
  views: { ${
    Object.keys(componentViews)
      .map(key => `'${key}': require(\`${resolve(componentViews[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } },
  pages: { ${
    Object.keys(componentPages)
      .map(key => `'${key}': require(\`${resolve(componentPages[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } },
  models: { ${
    Object.keys(componentModels)
      .map(key => `'${key}': require(\`${resolve(componentModels[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } }
};

export const controllers = {
  views: { ${
    Object.keys(controllerViews)
      .map(key => `'${key}': require(\`${resolve(controllerViews[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } },
  pages: { ${
    Object.keys(controllerPages)
      .map(key => `'${key}': require(\`${resolve(controllerPages[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } },
  models: { ${
    Object.keys(controllerModels)
      .map(key => `'${key}': require(\`${resolve(controllerModels[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } }
};

export const actions = {
  client: { ${
    Object.keys(actions)
      .map(key => `'${key}': require(\`${resolve(actions[key]).split('\\').join('/')}\`).client,`)
      .join('')
    } },
  \$: { ${
    Object.keys(actions)
      .map(key => `'${key}': require(\`${resolve(actions[key]).split('\\').join('/')}\`).$,`)
      .join('')
    } }
};

export const configs = require(\`${resolve(workDirPath, 'nickel.config.js').split('\\').join('/')}\`).default;
`,
    'utf-8',
    () => { console.log('Bundled file has been updated.'); }
  );
};

// Check the file 'nickel.config.js'.
try {
  accessSync(resolve(workDirPath, 'nickel.config.js'));
} catch (e) {
  throw new Error(`You must provide a configuration file. At: ${resolve(workDirPath, 'nickel.config.js')}`);
}

// Initial the packages what will be exported.
let packages = {
  components: {
    views: scanDir(resolve(workDirPath, 'components/views')).reduce((obj, { path }) => ({
      ...obj,
      [path.substr(resolve(workDirPath, 'components/views').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'components/views').length - 1).split(/[\\\/]/).join('.')]: path
    }), {}),
    pages: scanDir(resolve(workDirPath, 'components/pages')).reduce((obj, { path }) => ({
      ...obj,
      [path.substr(resolve(workDirPath, 'components/pages').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'components/pages').length - 1).split(/[\\\/]/).join('.')]: path
    }), {}),
    models: scanDir(resolve(workDirPath, 'components/models')).reduce((obj, { path }) => ({
      ...obj,
      [path.substr(resolve(workDirPath, 'components/models').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'components/models').length - 1).split(/[\\\/]/).join('.')]: path
    }), {})
  },
  controllers: {
    views: scanDir(resolve(workDirPath, 'controllers/views')).reduce((obj, { path }) => ({
      ...obj,
      [path.substr(resolve(workDirPath, 'controllers/views').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'controllers/views').length - 1).split(/[\\\/]/).join('.')]: path
    }), {}),
    pages: scanDir(resolve(workDirPath, 'controllers/pages')).reduce((obj, { path }) => ({
      ...obj,
      [path.substr(resolve(workDirPath, 'controllers/pages').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'controllers/pages').length - 1).split(/[\\\/]/).join('.')]: path
    }), {}),
    models: scanDir(resolve(workDirPath, 'controllers/models')).reduce((obj, { path }) => ({
      ...obj,
      [path.substr(resolve(workDirPath, 'controllers/models').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'controllers/models').length - 1).split(/[\\\/]/).join('.')]: path
    }), {}),
    global: resolve(workDirPath, 'controllers/global.js')
  },
  actions: scanDir(resolve(__dirname, '../actions')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(__dirname, '../actions').length + 1, path.lastIndexOf('.') - resolve(__dirname, '../actions').length - 1).split(/[\\\/]/).join('.')]: path
  }), {}),
  configs: resolve(workDirPath, 'nickel.config.js')
};

// Export functions for server side.
export const requirePackage = path => {
  // When decomposing paths, note that the third and subsequent items of the path array need to be combined and separated by periods.
  let paths = path.split('.');
  if (paths.length > 3) paths = [paths[0], paths[1], paths.splice(2).join('.')];

  const dfs = (paths, packages) => {
    if (packages[paths[0]]) {
      if(typeof packages[paths[0]] === 'object' && paths.length > 1) {
        return dfs(paths.splice(1), packages[paths[0]]);
      } else if(paths.length === 1) {
        let required = require(packages[paths[0]]);
        return required.default || required;
      } else throw new Error('Unknown path!');
    } else throw new Error('Unknown path!');
  };

  return dfs(paths, packages);
};

export const getPackages = () => packages;

// Watch the files.
let stalkers = [
  create(resolve(workDirPath, 'components')).on('change', (type, fullPath) => {
    const rootPath = resolve(workDirPath, 'components');
    const pathArr = fullPath.substr(rootPath.length + 1).split(/[\/\\]/);

    // Filter unused folders and files.
    if (['views', 'pages', 'models'].indexOf(pathArr[0]) < 0) return;

    switch (type) {
      case 'create':
      case 'update':
        packages.components[pathArr[0]][pathArr.splice(1).join('.')] = fullPath;
        break;
      case 'delete':
        delete packages.components[pathArr[0]][pathArr.splice(1).join('.')];
        break;
    }
    bundler();
  }),
  create(resolve(workDirPath, 'controllers')).on('change', (type, fullPath) => {
    const rootPath = resolve(workDirPath, 'controllers');
    const pathArr = fullPath.substr(rootPath.length + 1).split(/[\/\\]/);

    // Filter unused folders and files.
    if (['views', 'pages', 'models', 'global.js'].indexOf(pathArr[0]) < 0) return;

    switch (type) {
      case 'create':
      case 'update':
        packages.components[pathArr[0]][pathArr.splice(1).join('.')] = fullPath;
        break;
      case 'delete':
        delete packages.components[pathArr[0]][pathArr.splice(1).join('.')];
        break;
    }
    bundler();
  }),
  create(resolve(__dirname, '../actions')).on('change', (type, fullPath) => {
    const rootPath = resolve(__dirname, '../actions');
    const path = fullPath.substr(rootPath.length + 1).split(/[\/\\]/).join('.');

    switch (type) {
      case 'create':
      case 'update':
        packages.actions[path] = fullPath;
        break;
      case 'delete':
        delete packages.actions[path];
        break;
    }
    bundler();
  }),
  create(resolve(workDirPath, 'nickel.config.js')).on('change', type => {
    if (type === 'delete') throw new Error('You must provide a configuration file.');
    packages.configs = resolve(workDirPath, 'nickel.config.js');
    bundler();
  })
];

process.on('exit', () => stalkers.forEach(e => e.close()));

import webpack from 'webpack';
import { resolve } from 'path';
import workDirPath from '../utils/workDirPath';

let listener = webpack({
  entry: resolve('../client/index.js'),
  output: {
    // TODO The temp file can write to RAM.
    path: resolve(workDirPath, 'dist'),
    filename: 'spa.js'
  }
}).watch({
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  if(err) console.error(err);
  else console.log('The bundled file has been updated, hash:', stats.hash)
});

process.on('exit', () => {
  listener.close(() => console.log('Bundler has been closed.'));
});
