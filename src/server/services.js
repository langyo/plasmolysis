import { resolve } from 'path';
import workDirPath from '../utils/workDirPath';
import { create } from 'watchr';
import scanDir from 'klaw-sync';

// TODO: It will be a child process in the future.
export const context = require(resolve(workDirPath, 'server/context'));

let configs = require(resolve(workDirPath, 'nickel.config.js')).default;
let controllers = {
  views: scanDir(resolve(workDirPath, 'controllers/views')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(workDirPath, 'controllers/views').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'controllers/views').length - 1).split(/[\\\/]/).join('.')]: require(path).default
  }), {}),
  pages: scanDir(resolve(workDirPath, 'controllers/pages')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(workDirPath, 'controllers/pages').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'controllers/pages').length - 1).split(/[\\\/]/).join('.')]: require(path).default
  }), {}),
  models: scanDir(resolve(workDirPath, 'controllers/models')).reduce((obj, { path }) => ({
    ...obj,
    [path.substr(resolve(workDirPath, 'controllers/models').length + 1, path.lastIndexOf('.') - resolve(workDirPath, 'controllers/models').length - 1).split(/[\\\/]/).join('.')]: require(path).default
  }), {}),
  global: require(resolve(workDirPath, 'controllers/global.js')).default
};
let actions = scanDir(resolve(__dirname, '../actions')).reduce((obj, { path }) => ({
  ...obj,
  [path.substr(resolve(__dirname, '../actions').length + 1, path.lastIndexOf('.') - resolve(__dirname, '../actions').length - 1).split(/[\\\/]/).join('.')]: require(path)
}), {});

let stalkers = [
  create(resolve(workDirPath, 'controllers')).on('change', (type, fullPath) => {
    const rootPath = resolve(workDirPath, 'controllers');
    const pathArr = fullPath.substr(rootPath.length + 1).split(/[\/\\]/);

    // Filter unused folders and files.
    if (['views', 'pages', 'models', 'global.js'].indexOf(pathArr[0]) < 0) return;

    switch (type) {
      case 'create':
      case 'update':
        controllers[pathArr[0]][pathArr.splice(1).join('.')] = require(fullPath).default;
        break;
      case 'delete':
        delete controllers[pathArr[0]][pathArr.splice(1).join('.')];
        break;
    }
  }),
  create(resolve(__dirname, '../actions')).on('change', (type, fullPath) => {
    const rootPath = resolve(__dirname, '../actions');
    const path = fullPath.substr(rootPath.length + 1).split(/[\/\\]/).join('.');

    switch (type) {
      case 'create':
      case 'update':
        actions[path] = require(fullPath);
        break;
      case 'delete':
        delete actions[path];
        break;
    }
  }),
  create(resolve(workDirPath, 'nickel.config.js')).on('change', type => {
    if (type === 'delete') throw new Error('You must provide a configuration file.');
    configs = require(resolve(workDirPath, 'nickel.config.js'));
  })
];
process.on('close', () => stalkers.forEach(e => e.close()));

let actionTypes = Object.keys(actions).reduce((obj, key) => (actions[key].server ? { ...obj, [key]: actions[key].server } : obj), {});
let actionCreators = Object.keys(actions).reduce((obj, key) => ({ ...obj, [key]: actions[key].$ }), {});

let preloadServices = {};
let apiServices = {};

for (let type of ['models', 'pages', 'views']) {
  for (let name of Object.keys(controllers[type])) {
    // Create the actions' map.
    let dealed = controllers[type][name](actionCreators);

    // Remove all special keys that are not used to express actions.
    if (type === 'pages') preloadServices[name] = dealed.preLoad || (async () => ({}));
    dealed = Object.keys(dealed)
      .filter(name => ['init', 'preLoad'].indexOf(name) < 0)
      .reduce((prev, next) => ({ ...prev, [next]: dealed[next] }), {});

    for (let action of Object.keys(dealed)) {
      for (let task of dealed[action]) {
        if (Object.keys(actionTypes).indexOf(task.type) >= 0) {
          apiServices[task.path] = (req, res) => actionTypes[task.type](task)(context, req, res);
        }
      }
    }
  }
}

export const createServer = server => {
  for (let path of Object.keys(apiServices)) {
    console.log(`New api service: ${path}`);
    server.use(`/api/${path}`, (req, res) => apiServices[path](req, res));
  }
  for (let pageName of Object.keys(preloadServices)) {
    console.log(`New preload service: ${pageName}`);
    server.use(`/preload/${pageName}`, (req, res) => {
      preloadServices[pageName](context, req.cookies).then(data => {
        res.send(JSON.stringify({
          data,
          cookies: {
            ...configs.initCookies,
            ...req.cookies
          }
        }));
        res.end();
      });
    });
  }
}