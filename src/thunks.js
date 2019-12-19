import { controllers } from './require';
import initData from '../configs/initData';

let thunks = {};
let initState = { models: {}, pages: {}, views: {}, data: initData };
let initStateForModels = {};

const actionTypes = {
  setState: task => async (payload, dispatch, state, type, name) => {
    if (type !== 'models') dispatch({
      type: 'framework.updateState',
      payload: {
        [type]: {
          [name]: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
        }
      }
    });
    else dispatch({
      type: 'framework.updateState',
      payload: {
        [type]: {
          [name]: {
            [payload.$id]: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
          }
        }
      }
    });
    return payload;
  },
  setData: task => async (payload, dispatch, state, type, name) => {
    dispatch({
      type: 'framework.updateState',
      payload: {
        data: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
      }
    });
    return payload;
  },
  dispatch: task => async (payload, dispatch, state, type, name) => {
    let ret = typeof task.obj === 'function' ? task.obj(payload, state) : task.obj;
    if (/^framework\./.test(ret.type)) {
      if (['togglePage, updateState, createModel, destoryModel'].indexOf(ret.type) < 0)
        throw new Error(`There is no action named ${ret.payload}!`);
      dispatch({ ...ret });
    }
    else {
      if (Object.keys(thunks).indexOf(ret.type) < 0)
        throw new Error(`There is no action named ${ret.payload}!`);
      dispatch(thunks[ret.type](ret.payload));
    };
    return payload;
  },
  togglePage: task => async (payload, dispatch, state, type, name) => {
    dispatch({ type: 'framework.togglePage', payload: task.func ? task.func(payload, state.data) : { name: task.name, params: task.params } });
    return payload;
  },
  createModel: task => async (payload, dispatch, state, type, name) => {
    if (task.func) {
      let ret = task.func(payload);
      if (!ret.name) throw new Error('You must provide the name of the model!');
      dispatch({ type: 'framework.createModel', payload: ret });
    } else {
      dispatch({ type: 'framework.createModel', payload: { name: task.name, payload: task.payload } });
    }
    return payload;
  },
  destoryModel: task => async (payload, dispatch, state, type, name) => {
    if (task.func) {
      let ret = task.func(payload);
      if (!ret.name) throw new Error('You must provide the name of the model!');
      if (!ret.id) throw new Error('You must provide the model id!');
      dispatch({ type: 'framework.destoryModel', payload: ret });
    } else {
      dispatch({ type: 'framework.destoryModel', payload: { name: task.name, id: task.id } });
    }
    return payload;
  },
  fetchCombine: task => async (payload, dispatch, state, type, name) => fetch(task.fetch.host + task.route.path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    ...task.fetch,
    body: task.send ? JSON.stringify(task.send(payload, state)) : '{}'
  }).then(res => res.json()).then(json => {
    console.log('payload track', payload)
    next({ ...json, $id: payload && payload.$id || null }, dispatch, state);
  }),
  deal: task => async (payload, dispatch, state, type, name) => await (new Promise(resolve => task.func(payload, dispatch, state, resolve))),
  wait: task => async (payload, dispatch, state, type, name) => await (new Promise(resolve => setTimeout(() => resolve(payload, dispatch, state), task.length))),
  setCookies: task => async (payload, dispatch, state, type, name) => {
    let cookies = task.func ? task.func(payload, state.data.cookies, state.data) : task.obj;
    dispatch({
      type: 'framework.updateState', payload: {
        data: {
          cookies
        }
      }
    });
    Object.keys(cookies).forEach(key =>
      document.cookie = `${key}=${typeof cookies[key] === 'object' || Array.isArray(cookies[key]) ?
        escape(JSON.parse(cookies[key])) :
        escape(cookies[key])}`);
    return payload;
  }
};

const createTasks = (test, tasks, path, type, name) => async (payload, dispatch, state) => {
  if (!test(payload, state[type][name], state.data)) {
    console.log(`The action ${path} has been skiped.`);
    return payload;
  }
  console.log(`The action ${path} will be executed`);
  for (let i = 0; i < tasks.length; ++i) {
    if (!Array.isArray(tasks[i])) {
      try {
        let payload = await actionTypes[tasks[i].type](tasks[i])(payload, dispatch, state, type, name);
        console.log(`The action ${path} has runned to step ${i}, the payload is`, payload);
      } catch (e) {
        console.error(`The action ${path} failed to execute, because`, e);
        throw e;
      }
    } else {
      let payload = await createTasks(tasks[i][0], tasks[i].slice(1), `${path}[${i}]`, type, name)(payload, dispatch, state);
      console.log(`The action ${path}[${i}] has been executed.`);
    }
    return payload;
  }
};

for (let type of ['models', 'pages', 'views']) {
  for (let name of Object.keys(controllers[type])) {
    // 生成动作表
    let dealed = controllers[type][name]({
      deal: func => {
        if (!func) throw new Error('You must provide a function!');
        return { type: 'deal', func };
      },
      togglePage: (obj, params) => {
        if (typeof obj === 'function') return { type: 'togglePage', func: obj };
        if (Object.keys(controllers.pages).indexOf(obj) < 0) throw new Error(`No page named ${obj}!`);
        return { type: 'togglePage', name: obj, params };
      },
      createModel: (obj1, obj2) => {
        if (typeof obj1 === 'function') {
          return { type: 'createModel', func: obj1 };
        }
        else if (typeof obj1 === 'string') {
          return { type: 'createModel', name: obj1, payload: obj2 === undefined ? {} : obj2 };
        }
        else throw new Error('The first argument must be a function or a string!');
      },
      destoryModel: (obj1, obj2) => {
        if (typeof obj1 === 'function') {
          return { type: 'destoryModel', func: obj1 };
        }
        else if (typeof obj1 === 'string') {
          if (!obj2) throw new Error('You must provide the model id!');
          return { type: 'destoryModel', name: obj1, payload: { id: obj2 } };
        }
        else throw new Error('The first argument must be a function or a string!');
      },
      setState: obj => {
        if (!obj) throw new Error('You must provide a function or an object!');
        return { type: 'setState', obj };
      },
      setData: obj => {
        if (!obj) throw new Error('You must provide a function or an object!');
        return { type: 'setData', obj };
      },
      dispatch: obj => {
        if (!obj) throw new Error('You must provide a function or an object!');
        return { type: 'dispatch', obj };
      },
      fetch: obj => {
        if (typeof obj !== 'object') throw new Error('You must provide an object!');
        if (!obj.host) obj.host = '';
        return { type: 'fetch', obj: obj };
      },
      send: func => {
        if (typeof func !== 'function') throw new Error('You must provide a function!');
        return { type: 'send', func };
      },
      route: obj => {
        if (typeof obj !== 'object') throw new Error('You must provide an object!');
        return { type: 'route', obj };
      },
      handle: () => ({ type: 'handle' }),
      wait: length => {
        if (typeof length !== 'number') throw new Error('You must provide an integer!');
        return { type: 'wait', length };
      },
      setCookies: obj => {
        if (typeof obj === 'function') return { type: 'setCookies', func: obj };
        else if (typeof obj !== 'object') throw new Error('You must provide a function or an object!');
        return { type: 'setCookies', obj };
      }
    });

    // 去除所有的不用于表达动作的特殊键
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

    // 整合所有的 fetch
    dealed = Object.keys(dealed).reduce((prev, action) => {
      if (dealed[action]) {
        return ({
          ...prev,
          [action]: Object.keys(dealed[action]).reduce((prev, next) => {
            if (dealed[action][next]) {
              switch (dealed[action][next].type) {
                case 'fetch':
                  prev.fetchObj.fetch = dealed[action][next].obj;
                  return prev;
                case 'send':
                  prev.fetchObj.send = dealed[action][next].func;
                  return prev;
                case 'route':
                  prev.fetchObj.route = dealed[action][next].obj;
                  return prev;
                case 'handle':
                  return { list: [...prev.list, { type: 'fetchCombine', ...prev.fetchObj }], fetchObj: {} };
                default:
                  return { ...prev, list: [...prev.list, dealed[action][next]] };
              }
            }
            else return prev;
          }, { list: [], fetchObj: {} }).list
        });
      }
      else return prev;
    }, {});

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
