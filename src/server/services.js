import { context, fileEmitter, packages } from '../utils/require';
import { EventEmitter } from 'events';

let configs = require(packages.configs).default;
let controllers = { 
  views: Object.keys(packages.controllers.views).reduce((obj, key) => ({
    ...obj,
    [key]: require(packages.controllers.views[key]).default
  }), {}),
  pages: Object.keys(packages.controllers.pages).reduce((obj, key) => ({
    ...obj,
    [key]: require(packages.controllers.pages[key]).default
  }), {}),
  models: Object.keys(packages.controllers.models).reduce((obj, key) => ({
    ...obj,
    [key]: require(packages.controllers.models[key]).default
  }), {})
};
let actions = Object.keys(packages.actions).reduce((obj, key) => ({
  ...obj,
  [key]: require(packages.actions[key])
}), {});
let actionTypes = Object.keys(actions).reduce((obj, key) => (actions[key].server ? { ...obj, [key]: actions[key].server } : obj), {});
let actionCreators = Object.keys(actions).reduce((obj, key) => ({ ...obj, [key]: actions[key].$ }), {});

let serviceUpdater = new EventEmitter();

fileEmitter.on('create', (type, subType, path, src) => {
  switch(type) {
    case 'controllers':
      controllers[subType][path] = require(src);
      serviceUpdater.emit('create', subType, path);
      break;
    default:
      break;
  }
});
fileEmitter.on('delete', (type, subType, path, src) => {
  switch(type) {
    case 'controllers':
      delete controllers[subType][path];
      serviceUpdater.emit('delete', subType, path);
      break;
    default:
      break;
  }
});
fileEmitter.on('createAction', (path, src) => {
  let required = require(src);
  if(required.server) {
    actionTypes[path] = required.server;
    actionCreators[path] = required.$;
  }
});
fileEmitter.on('updateAction', (path, src) => {
  let required = require(src);
  if(required.server) {
    actionTypes[path] = required.server;
    actionCreators[path] = required.$;
  }
});
fileEmitter.on('deleteAction', path => {
  if(actionTypes[path]) delete actionTypes[path];
  if(actionCreators[path]) delete actionCreators[path];
});

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

export default server => {
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

  serviceUpdater.on('create', (subType, path) => {
    // TODO: Update the preload service and api service.
  });
  serviceUpdater.on('delete', (subType, path) => {
    // TODO: Update the preload service and api service.
  })
}