import { controllers, actions, configs } from '../staticRequire';

let initState = {  pages: {}, views: {}, models: {}, data: configs.initData || {} };

const actionTypes = Object.keys(actions).reduce((obj, key) => (actions[key].client ? { ...obj, [key]: actions[key].client } : obj));
const actionCreators = Object.keys(actions).reduce((obj, key) => ({ ...obj, [key]: actions[key].$ }));

for (let type of ['pages', 'views']) {
  for (let name of Object.keys(controllers[type])) {
    // Create the actions' map.
    let dealed = controllers[type][name](actionCreators);

    // Get the initialize state.
    if (dealed.init) initState[type][name] = dealed.init;
    else initState[type][name] = {};
  }
}

for (let name of Object.keys(controllers.models)) {
  initState.models[name] = {};
}

export { initState };
