import { EventEmitter } from 'events';
import { resolve } from 'path';
import { watch, accessSync, writeFile } from 'fs';

import { scanDir, watchDir } from './fileUtil';

const envDemo = process.env.DEMO;

export const workDirPath = resolve(envDemo ? `${process.cwd()}/demo/${envDemo}` : `${process.cwd()}`);
export const distPath = resolve(__dirname, './staticRequire.js');

let fileEmitter = new EventEmitter();
export { fileEmitter };

export const context = require(envDemo ? `${process.cwd()}/demo/${envDemo}/server/context.js` : `${process.cwd()}/server/context.js`);

let componentViews = scanDir(resolve(workDirPath, './components/views'));
let componentPages = scanDir(resolve(workDirPath, './components/pages'));
let componentModels = scanDir(resolve(workDirPath, './components/models'));

let controllerViews = scanDir(resolve(workDirPath, './controllers/views'));
let controllerPages = scanDir(resolve(workDirPath, './controllers/pages'));
let controllerModels = scanDir(resolve(workDirPath, './controllers/models'));

let actions = scanDir(resolve(__dirname, '../actions'));

try {
  accessSync(resolve(workDirPath, 'nickel.config.js'));
} catch (e) {
  throw new Error('You must provide a configuration file.');
}

let serverRequirePaths = {
  components: {
    views: componentViews,
    pages: componentPages,
    models: componentModels
  },
  controllers: {
    views: controllerViews,
    pages: controllerPages,
    models: controllerModels
  },
  actions: actions,
  configs: resolve(workDirPath, 'nickel.config.js')
};
export { serverRequirePaths };

const packageBundle = () => writeFile(distPath,
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
  // 记得处理未定义 client 键的情况！
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
  () => {}
);

let componentViewsEmitter = watchDir(resolve(workDirPath, './components/views'));
let componentPagesEmitter = watchDir(resolve(workDirPath, './components/pages'));
let componentModelsEmitter = watchDir(resolve(workDirPath, './components/models'));

let controllerViewsEmitter = watchDir(resolve(workDirPath, './controllers/views'));
let controllerPagesEmitter = watchDir(resolve(workDirPath, './controllers/pages'));
let controllerModelsEmitter = watchDir(resolve(workDirPath, './controllers/models'));

let actionsEmitter = watchDir(resolve(__dirname, '../actions'));

componentViewsEmitter.on('create', (path, src) => fileEmitter.emit('create', 'components', 'views', path, src), packageBundle());
componentPagesEmitter.on('create', (path, src) => fileEmitter.emit('create', 'components', 'pages', path, src), packageBundle());
componentModelsEmitter.on('create', (path, src) => fileEmitter.emit('create', 'components', 'models', path, src), packageBundle());

controllerViewsEmitter.on('create', (path, src) => fileEmitter.emit('create', 'controllers', 'views', path, src), packageBundle());
controllerPagesEmitter.on('create', (path, src) => fileEmitter.emit('create', 'controllers', 'pages', path, src), packageBundle());
controllerModelsEmitter.on('create', (path, src) => fileEmitter.emit('create', 'controllers', 'models', path, src), packageBundle());

actionsEmitter.on('create', (path, src) => fileEmitter.emit('createAction', path, src), packageBundle());

componentViewsEmitter.on('update', (path, src) => fileEmitter.emit('update', 'components', 'views', path, src));
componentPagesEmitter.on('update', (path, src) => fileEmitter.emit('update', 'components', 'pages', path, src));
componentModelsEmitter.on('update', (path, src) => fileEmitter.emit('update', 'components', 'models', path, src));

controllerViewsEmitter.on('update', (path, src) => fileEmitter.emit('update', 'controllers', 'views', path, src));
controllerPagesEmitter.on('update', (path, src) => fileEmitter.emit('update', 'controllers', 'pages', path, src));
controllerModelsEmitter.on('update', (path, src) => fileEmitter.emit('update', 'controllers', 'models', path, src));

actionsEmitter.on('update', (path, src) => fileEmitter.emit('updateAction', path, src));

componentViewsEmitter.on('delete', path => fileEmitter.emit('delete', 'components', 'views', path), packageBundle());
componentPagesEmitter.on('delete', path => fileEmitter.emit('delete', 'components', 'pages', path), packageBundle());
componentModelsEmitter.on('delete', path => fileEmitter.emit('delete', 'components', 'models', path), packageBundle());

controllerViewsEmitter.on('delete', path => fileEmitter.emit('delete', 'controllers', 'views', path), packageBundle());
controllerPagesEmitter.on('delete', path => fileEmitter.emit('delete', 'controllers', 'pages', path), packageBundle());
controllerModelsEmitter.on('delete', path => fileEmitter.emit('delete', 'controllers', 'models', path), packageBundle());

actionsEmitter.on('delete', path => fileEmitter.emit('deleteAction', path), packageBundle())

watch(resolve(workDirPath, 'nickel.config.js'), type => {
  if (type === 'update') fileEmitter.emit('updateConfigs');
});
