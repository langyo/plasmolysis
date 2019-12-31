import { EventEmitter } from 'events';
import { watchDir, watchFile, writeFile } from './fileUtil';
import packager from './packager';

const envDemo = process.env.DEMO;

const makePackage = (obj, path) => {
  let bundled = `export default {
    ${Object.keys(obj)
      .map(key => `'${key}': require(${obj[key]})`)
      .reduce((p, n) => `${p},\n${n}`)}
  };`;
  writeFile(packager(bundled), path);
};

let controllers = {};
let controllersEmitter = new EventEmitter();
watchDir(envDemo ? `${__dirname}/demo/${envDemo}/controllers` : `${__dirname}/controllers`, (src, type, path) => {
  switch (type) {
    case 'delete':
      delete controllers[src];
      controllersEmitter.emit('delete', src);
      makePackage(controllers, envDemo ? `${__dirname}/demo/${envDemo}/dist/controllers.js` : `${__dirname}/dist/controllers.js`)
      break;
    case 'init':
      break;
    case 'update':
      controllersEmitter.emit('update', src, controllers[src]);
      break;
    case 'create':
      controllers[src] = path;
      controllersEmitter.emit('update', src, controllers[src]);
      makePackage(controllers, envDemo ? `${__dirname}/demo/${envDemo}/dist/controllers.js` : `${__dirname}/dist/controllers.js`)
      break;
    default:
      throw new Error(`Unknown file status type: ${type}`);
  }
});

let components = {};
watchDir(envDemo ? `${__dirname}/demo/${envDemo}/components` : `${__dirname}/components`, (src, type, path) => {
  switch (type) {
    case 'delete':
      delete components[src];
      makePackage(controllers, envDemo ? `${__dirname}/demo/${envDemo}/dist/components.js` : `${__dirname}/dist/components.js`)
      break;
    case 'init':
    case 'update':
      break;
    case 'create':
      components[src] = path;
      makePackage(controllers, envDemo ? `${__dirname}/demo/${envDemo}/dist/components.js` : `${__dirname}/dist/components.js`)
      break;
    default:
      throw new Error(`Unknown file status type: ${type}`);
  }
});

let types = { client: {}, server: {}, $: {} };
let typesEmitter = new EventEmitter();
watchDir('../controllers', (src, type, path) => {
  switch (type) {
    case 'delete':
      if (types.client[path]) delete types.client[path];
      if (types.server[path]) delete types.server[path];
      if (types.$[path]) delete types.$[path];
      typesEmitter.emit('delete', path);
      makePackage(types, envDemo ? `${__dirname}/demo/${envDemo}/dist/types.js` : `${__dirname}/dist/types.js`);
      break;
    case 'init':
      let required = require(src);
      if (required.client) {
        if (typeof required.client !== 'function') throw new Error('You must provide a function as a client loader.');
        types.client[path] = required.client;
      }
      if (required.server) {
        if (typeof required.server !== 'function') throw new Error('You must provide a function as a server loader.');
        types.server[path] = required.server;
      }
      if (!required.$ || typeof required.$ !== 'function') throw new Error('You must provide a function as an action parser.');
      types.$[path] = required.$;
      makePackage(types, envDemo ? `${__dirname}/demo/${envDemo}/dist/types.js` : `${__dirname}/dist/types.js`);
      break;
    case 'update':
    case 'create':
      let required = require(src);
      if (required.client) {
        if (typeof required.client !== 'function') throw new Error('You must provide a function as a client loader.');
        types.client[path] = required.client;
      }
      if (required.server) {
        if (typeof required.server !== 'function') throw new Error('You must provide a function as a server loader.');
        types.server[path] = required.server;
      }
      if (!required.$ || typeof required.$ !== 'function') throw new Error('You must provide a function as an action parser.');
      types.$[path] = required.$;
      typesEmitter.emit('update', path, types);
      makePackage(types, envDemo ? `${__dirname}/demo/${envDemo}/dist/types.js` : `${__dirname}/dist/types.js`);
      break;
  }
});


export const configsPath = envDemo ? `${__dirname}/demo/${envDemo}/nickel.config.js` : `${__dirname}/nickel.config.js`;
export const controllersPath = envDemo ? `${__dirname}/demo/${envDemo}/dist/controllers.js` : `${__dirname}/dist/controllers.js`;
export const componentsPath = envDemo ? `${__dirname}/demo/${envDemo}/dist/components.js` : `${__dirname}/dist/components.js`;
export const typesPath = envDemo ? `${__dirname}/demo/${envDemo}/dist/types.js` : `${__dirname}/dist/types.js`;

let configs = require(configsPath);
let configsEmitter = new EventEmitter();
watchFile(configsPath, () => {
  configs = require(configsPath);
  configsEmitter.emit('update', configs);
});

export const controllersPkg = { package: controllers, listener: controllersEmitter };
export const configsPkg = { package: configs, listener: configsEmitter };
export const typesPkg = { package: types, listener: typesEmitter };
export const context = require(envDemo ? `${__dirname}/demo/${envDemo}/server/context.js` : `${__dirname}/server/context.js`);
