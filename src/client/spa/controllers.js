import { controllers, actions, configs } from '../staticRequire';

let controllerStreams = {};
let controllerStreamsMapped = { models: {}, pages: {}, views: {}, global: {} };
let initState = { models: {}, pages: {}, views: {}, data: configs.initData || {} };

const actionTypes = Object.keys(actions).reduce((obj, key) => (actions[key].client ? { ...obj, [key]: actions[key].client } : obj));
const actionCreators = Object.keys(actions).reduce((obj, key) => ({ ...obj, [key]: actions[key].$ }));

export default ({ setState, replaceState, getState }) => {
  const createTasks = (test, tasks, path, { type, name }) => async payload => {
    if (!test(payload, getState()[type][name], getState().data)) {
      console.log(`The action ${path} has been skiped.`);
      return payload;
    }
    console.log('Get payload', payload);
    console.log(`The action ${path} will be executed`);
    for (let i = 0; i < tasks.length; ++i) {
      console.log('Middle process', tasks[i], 'at', i, ', the total length is', tasks.length);
      if (!Array.isArray(tasks[i])) {
        try {
          payload = await actionTypes[tasks[i].type](tasks[i])(payload, {
            setState: state => new Promise(resolve => setState(state, resolve)),
            replaceState: state => new Promise(resolve => replaceState(state, resolve)),
            getState,
            dispatcher: (type, obj) => {
              if (!controllerStreams[type]) throw new Error('No corresponding controller found.')
              controllerStreams[type](obj);
            },
            getInitState: () => initState
          }, { type, name });
          console.log(`The action ${path} has runned to step ${i}, the payload is`, payload);
        } catch (e) {
          console.error(`The action ${path} failed to execute, because`, e);
          throw e;
        }
      } else {
        payload = await createTasks(tasks[i][0], tasks[i].slice(1), `${path}[${i}]`, { type, name })(payload);
        console.log(`The action ${path}[${i}] has been executed.`);
      }
    }
    return payload;
  };

  for (let type of ['models', 'pages', 'views']) {
    for (let name of Object.keys(controllers[type])) {
      // Create the actions' map.
      let dealed = controllers[type][name](actionCreators);

      // Get initialization objects.
      if (dealed.init) {
        initState[type][name] = dealed.init;
      }
      else initState[type][name] = {};

      // Remove all special keys that are not used to express actions.
      dealed = Object.keys(dealed)
        .filter(name => ['init', 'preLoad'].indexOf(name) < 0)
        .reduce((prev, next) => ({ ...prev, [next]: dealed[next] }), {});

      // Create action streams.
      for (let action of Object.keys(dealed)) {
        let controller = payload =>
          createTasks(() => true, dealed[action], `${type}.${name}.${action}`, { type, name })
            (payload)
            .then(() => console.log(`The action ${type}.${name}.${action} has been executed`));

        controllerStreams[`${type}.${name}.${action}`] = controller;
        if (!controllerStreamsMapped[type][name]) controllerStreamsMapped[type][name] = {};
        controllerStreamsMapped[type][name][action] = controller;
      }
    }
  }

  // TODO global.initSuccess global.initFail

  return controllerStreamsMapped;
};
