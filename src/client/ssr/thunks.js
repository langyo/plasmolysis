import { getPackages, requirePackage } from '../../server/watcher';

let initState = {  pages: {}, views: {}, models: {}, data: requirePackage(`configs`).initData || {} };
const actionCreators = Object.keys(getPackages().actions).reduce((obj, key) => ({ ...obj, [key]: requirePackage(`actions.${key}`).$ }), {});

for (let type of ['pages', 'views']) {
  for (let name of Object.keys(getPackages().controllers[type])) {
    // Create the actions' map.
    let dealed = requirePackage(`controllers.${type}.${name}`)(actionCreators);

    // Get the initialize state.
    if (dealed.init) initState[type][name] = dealed.init;
    else initState[type][name] = {};
  }
}

for (let name of Object.keys(getPackages().controllers.models)) {
  initState.models[name] = {};
}

export { initState };
