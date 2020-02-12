import { requirePackage, getPackages } from './watcher';

export default () => {
  // TODO configs.initData move to the global controller.
  let initState = { models: {}, pages: {}, views: {}, data: configs.initData || {} };
  let preloadPageState = {};

  for (let type of ['models', 'pages', 'views']) {
    for (let name of Object.keys(getPackages().controllers[type])) {
      // Create the actions' map.
      let dealed = requirePackage(`controllers.${type}.${name}`)({});

      // Get initialization objects.
      if (dealed.init) {
        initState[type][name] = dealed.init;
      }
      else initState[type][name] = {};

      // Get preloaders.
      if (type === 'pages' && dealed.preload) {
        preloadPageState[name] = dealed.preload;
      }
    }
  }

  // TODO global.initSuccess global.initFail

  return { initState, preloadPageState };
}