import { context, configsPkg, controllersPkg, typesPkg } from '../utils/require';

let configs = configsPkg.package;
let controllers = controllersPkg.package;
let types = typesPkg.package;

configsPkg.listener.on('update', n => configs = n);
controllersPkg.listener.on('update', (src, controller) => {
  controllers[src] = controller;
});
controllersPkg.listener.on('delete', src => delete controllers[src]);
typesPkg.listener.on('update', t => types = t);

let actionTypes = Object.keys(types).reduce((obj, key) => (types[key].server ? { ...obj, [key]: types[key].server } : obj));
let actionCreators = Object.keys(types).reduce((obj, key) => ({ ...obj, [key]: types[key].$ }));
typesPkg.listener.on(
  'update',
  () => {
    actionTypes = Object.keys(types).reduce((obj, key) => (types[key].server ? { ...obj, [key]: types[key].server } : obj));
    actionCreators = Object.keys(types).reduce((obj, key) => ({ ...obj, [key]: types[key].$ }));
  }
);

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
    console.log(`New api service: ${path}`)
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