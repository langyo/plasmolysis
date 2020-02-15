import { requirePackage, getPackages } from './watcher';

export default () => {
  // TODO configs.initData move to the global controller.
  let initState = { models: {}, pages: {}, views: {}, data: requirePackage('configs').initData || {} };

  for (let type of ['models', 'pages', 'views']) {
    for (let name of Object.keys(getPackages().controllers[type])) {
      // Create the actions' map.
      let dealed = requirePackage(`controllers.${type}.${name}`)(Object.keys(getPackages().actions).reduce((obj, key) => ({ ...obj, [key]: () => {} }), {}));

      // Get initialization objects.
      if (dealed.init) {
        initState[type][name] = dealed.init;
      }
      else initState[type][name] = {};
    }
  }
  return initState;
}