import { EventEmitter } from 'events';
import { resolve } from 'path';
import { makeDir, watchDir, watchFile, writeFile } from './fileUtil';

const envDemo = process.env.DEMO.trim();

const makePackagedFile = (obj, path) => {
  const dfs = obj => `{
      ${Object.keys(obj)
      .map(key => `'${key}': require('${obj[key]}')`)
      .reduce((p, n) => `${p},
        ${n}`, '')}
    }`;
  writeFile(`export default ${dfs(obj)};`, path);
};

makeDir(envDemo ? `${process.cwd()}/demo/${envDemo}/dist` : `${process.cwd()}/dist/`)

let controllers = { pages: {}, views: {}, models: {} };
let controllersEmitter = new EventEmitter();

// Pages
watchDir(envDemo ? `${process.cwd()}/demo/${envDemo}/controllers/pages` : `${process.cwd()}/controllers/pages`, (src, type) => {
  console.log(src, type)
  switch (type) {
    case 'delete':
      delete controllers.pages[path];
      controllersEmitter.emit('delete', path);
      makePackagedFile(controllers, envDemo ? `${process.cwd()}/demo/${envDemo}/dist/controllers.js` : `${process.cwd()}/dist/controllers.js`);
      break;
    case 'init':
      break;
    case 'update':
      controllersEmitter.emit('update', path, controllers[src]);
      break;
    case 'create':
      controllers[path] = src;
      controllersEmitter.emit('update', path, controllers[src]);
      makePackagedFile(controllers, envDemo ? `${process.cwd()}/demo/${envDemo}/dist/controllers.js` : `${process.cwd()}/dist/controllers.js`);
      break;
    default:
      throw new Error(`Unknown file status type: ${type}`);
  }
  console.log('controllers', controllers);
}, 'pages');

let components = { pages: {}, views: {}, models: {} };
watchDir(envDemo ? `${process.cwd()}/demo/${envDemo}/components` : `${process.cwd()}/components/`, (src, type, path) => {
  switch (type) {
    case 'delete':
      delete components[path];
      makePackagedFile(controllers, envDemo ? `${process.cwd()}/demo/${envDemo}/dist/components.js` : `${process.cwd()}/dist/components.js`);
      break;
    case 'init':
    case 'update':
      break;
    case 'create':
      components[path] = src;
      makePackagedFile(controllers, envDemo ? `${process.cwd()}/demo/${envDemo}/dist/components.js` : `${process.cwd()}/dist/components.js`);
      break;
    default:
      throw new Error(`Unknown file status type: ${type}`);
  }
});

let types = { client: {}, server: {}, $: {}, src: {} };
const typesDistPath = envDemo ? `${process.cwd()}/demo/${envDemo}/dist/types.js` : `${process.cwd()}/dist/types.js`;
let typesEmitter = new EventEmitter();

const makeTypesPackagedFile = () => {
  let packaged = `export default {
      client: {
        ${Object.keys(types.client)
      .map(key => `'${key}': require('${types.src[key]}').client`)
      .reduce((p, n) => `${p},
          ${n}`)}
      },
      $: {
        ${Object.keys(types.$)
      .map(key => `'${key}': require('${types.src[key]}').$`)
      .reduce((p, n) => `${p},
            ${n}`)}
      }
    }
  }`;
  writeFile(packaged, typesDistPath);
};

watchDir(resolve(__dirname, '../controllers'), (src, type, path) => {
  let required;
  switch (type) {
    case 'delete':
      if (types.client[path]) delete types.client[path];
      if (types.server[path]) delete types.server[path];
      if (types.$[path]) delete types.$[path];
      typesEmitter.emit('delete', path);
      makeTypesPackagedFile();
      break;
    case 'init':
      required = require(src);
      if (required.client) {
        if (typeof required.client !== 'function') throw new Error(`You must provide a function as a client loader: ${src}`);
        types.client[path] = required.client;
      }
      if (required.server) {
        if (typeof required.server !== 'function') throw new Error(`You must provide a function as a server loader: ${src}`);
        types.server[path] = required.server;
      }
      if ((!required.$) || typeof required.$ !== 'function') throw new Error(`You must provide a function as an action parser: ${src}`);
      types.$[path] = required.$;
      types.src[path] = src;
      makeTypesPackagedFile();
      break;
    case 'update':
    case 'create':
      required = require(src);
      if (required.client) {
        if (typeof required.client !== 'function') throw new Error(`You must provide a function as a client loader: ${src}`);
        types.client[path] = required.client;
      }
      if (required.server) {
        if (typeof required.server !== 'function') throw new Error(`You must provide a function as a server loader: ${src}`);
        types.server[path] = required.server;
      }
      if ((!required.$) || typeof required.$ !== 'function') throw new Error(`You must provide a function as an action parser: ${src}`);
      types.$[path] = required.$;
      typesEmitter.emit('update', path, types);
      makeTypesPackagedFile();
      break;
  }
});

export const configsPath = envDemo ? `${process.cwd()}/demo/${envDemo}/nickel.config.js` : `${process.cwd()}/nickel.config.js`;
export const controllersPath = envDemo ? `${process.cwd()}/demo/${envDemo}/dist/controllers.js` : `${process.cwd()}/dist/controllers.js`;
export const componentsPath = envDemo ? `${process.cwd()}/demo/${envDemo}/dist/components.js` : `${process.cwd()}/dist/components.js`;
export const typesPath = envDemo ? `${process.cwd()}/demo/${envDemo}/dist/types.js` : `${process.cwd()}/dist/types.js`;

writeFile(`
  export const configsPath = '${configsPath.split('\\').join('/')}';
  export const controllersPath = '${controllersPath.split('\\').join('/')}';
  export const componentsPath = '${componentsPath.split('\\').join('/')}';
  export const typesPath = '${typesPath.split('\\').join('/')}';
`, resolve(__dirname, '../../paths.js'));

let configs = require(configsPath);
let configsEmitter = new EventEmitter();
watchFile(configsPath, () => {
  configs = require(configsPath);
  configsEmitter.emit('update', configs);
});

export const controllersPkg = { package: controllers, listener: controllersEmitter };
export const configsPkg = { package: configs, listener: configsEmitter };
export const typesPkg = { package: types, listener: typesEmitter };
export const context = require(envDemo ? `${process.cwd()}/demo/${envDemo}/server/context.js` : `${process.cwd()}/server/context.js`);
