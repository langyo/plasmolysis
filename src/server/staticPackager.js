import { resolve } from 'path';
import { create } from 'watchr';
import { accessSync, writeFile } from 'fs';
import scanDir from 'klaw-sync';

const workDirPath = process.env.WORKDIR;
const distPath = resolve(__dirname, '../staticRequire.js');

const packageBundle = () => {
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
packages.configs = require(resolve(workDirPath, 'nickel.config.js')).default;

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
    packageBundle();
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
    packageBundle();
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
    packageBundle();
  }),
  create(resolve(workDirPath, 'nickel.config.js')).on('change', type => {
    if (type === 'delete') throw new Error('You must provide a configuration file.');
    packages.configs = resolve(workDirPath, 'nickel.config.js');
    packageBundle();
  })
];
process.on('close', () => stalkers.forEach(e => e.close()));
