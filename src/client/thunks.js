import { controllersPath, typesPath, configsPath } from '../../paths';
const controllers = require(controllersPath);
const types = require(typesPath);
const configs = require(configsPath);

let thunks = {};
let initState = { models: {}, pages: {}, views: {}, data: configs.initData || {} };
let initStateForModels = {};

const actionTypes = Object.keys(types).reduce((obj, key) => (types[key].client ? { ...obj, [key]: types[key].client } : obj));
const actionCreators = Object.keys(types).reduce((obj, key) => ({ ...obj, [key]: types[key].$ }));

const createTasks = (test, tasks, path, type, name) => async (payload, dispatch, state) => {
  if (!test(payload, state[type][name], state.data)) {
    console.log(`The action ${path} has been skiped.`);
    return payload;
  }
  console.log('Get payload', payload);
  console.log(`The action ${path} will be executed`);
  for (let i = 0; i < tasks.length; ++i) {
    console.log('middle process', tasks[i], 'at', i, ', the total length is', tasks.length);
    if (!Array.isArray(tasks[i])) {
      try {
        payload = await actionTypes[tasks[i].type](tasks[i])(payload, dispatch, state, type, name);
        console.log(`The action ${path} has runned to step ${i}, the payload is`, payload);
      } catch (e) {
        console.error(`The action ${path} failed to execute, because`, e);
        throw e;
      }
    } else {
      payload = await createTasks(tasks[i][0], tasks[i].slice(1), `${path}[${i}]`, type, name)(payload, dispatch, state);
      console.log(`The action ${path}[${i}] has been executed.`);
    }
  }
  return payload;
};

for (let type of ['models', 'pages', 'views']) {
  for (let name of Object.keys(controllers[type])) {
    // Create the actions' map.
    let dealed = controllers[type][name](actionCreators);

    // Remove all special keys that are not used to express actions.
    if (dealed.init) {
      if (type !== 'models') initState[type][name] = dealed.init;
      else {
        initState[type][name] = {};
        initStateForModels[name] = dealed.init;
      }
    }
    else initState[type][name] = {};
    dealed = Object.keys(dealed)
      .filter(name => ['init', 'preLoad'].indexOf(name) < 0)
      .reduce((prev, next) => ({ ...prev, [next]: dealed[next] }), {});

    for (let action of Object.keys(dealed)) {
      thunks[`${type}.${name}.${action}`] = payload => (dispatch, getState) => {
        createTasks(() => true, dealed[action], `${type}.${name}.${action}`, type, name)
          (payload, dispatch, getState(), type, name)
          .then(() => console.log(`The action ${type}.${name}.${action} has been executed`));
      };
    }
  }
}

export { thunks, initState, initStateForModels };
