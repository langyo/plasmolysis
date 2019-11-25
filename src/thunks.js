import { controllers } from './require';
import initData from '../configs/initData';

let thunks = {};
let initState = { models: {}, pages: {}, views: {}, data: initData };
let initStateForModels = {};

for (let type of ['models', 'pages', 'views']) {
  for (let name of Object.keys(controllers[type])) {
    // 生成动作表
    let dealed = controllers[type][name]({
      deal: func => ({ type: 'deal', func }),
      togglePage: name => ({ type: 'togglePage', name }),
      createModel: (name, payload) => ({ type: 'createModel', name, payload: payload ? payload : {} }),
      destoryModel: (name, id) => ({ type: 'destoryModel', name, payload: { id } }),
      setState: obj => ({ type: 'setState', obj }),
      setData: obj => ({ type: 'setData', obj }),
      dispatch: obj => ({ type: 'dispatch', obj }),
      fetch: func => ({ type: 'fetch', func }),
      send: func => ({ type: 'send', func }),
      route: obj => ({ type: 'route', obj }),
      handle: () => ({ type: 'handle' })
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
      .filter(name => name !== 'init')
      .reduce((prev, next) => ({ ...prev, [next]: dealed[next] }), {});

    // 对其中每个作为数组存在的元素进行扁平化
    dealed = Object.keys(dealed).reduce((prev, action) => {
      const dfs = arr => arr.reduce(
        (prev, next) => Array.isArray(next) ? prev.concat(dfs(next)) : [...prev, next],
        []
      );
      return ({
        ...prev,
        [action]: dfs(dealed[action])
      });
    }, {});

    // 整合所有的 fetch
    dealed = Object.keys(dealed).reduce((prev, action) => {
      if (dealed[action]) {
        return ({
          ...prev,
          [action]: Object.keys(dealed[action]).reduce((prev, next) => {
            if (dealed[action][next]) {
              switch (dealed[action][next].type) {
                case 'fetch':
                  prev.fetchObj.fetch = dealed[action][next].func;
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
      let subThunks = [];

      for (let task of dealed[action]) {
        switch (task.type) {
          case 'setState':
            subThunks.push(next => (payload, dispatch, state) => {
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
                    [id]: {
                      [name]: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
                    }
                  }
                }
              });
              next(payload, dispatch, state);
            });
            break;
          case 'setData':
            subThunks.push(next => (payload, dispatch, state) => {
              dispatch({
                type: 'framework.updateState',
                payload: {
                  data: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
                }
              });
              next(payload, dispatch, state);
            })
            break;
          case 'dispatch':
            subThunks.push(next => (payload, dispatch, state) => {
              let ret = typeof task.obj === 'function' ? task.obj(payload, state) : task.obj;
              if (/^framework\./.test(ret.type)) dispatch({ ...ret });
              else dispatch(thunks[ret.type](ret.payload));
              next(payload, dispatch, state);
            });
            break;
          case 'togglePage':
            subThunks.push(next => (payload, dispatch, state) => {
              dispatch({ type: 'framework.togglePage', payload: task.name });
              next(payload, dispatch, state);
            });
            break;
          case 'createModel':
            subThunks.push(next => (payload, dispatch, state) => {
              dispatch({ type: 'framework.createModel', payload: { name: task.name, payload: task.payload } });
              next(payload, dispatch, state);
            });
            break;
          case 'destoryModel':
            subThunks.push(next => (payload, dispatch, state) => {
              dispatch({ type: 'framework.createModel', payload: { name: task.name, id: task.id } });
              next(payload, dispatch, state);
            });
            break;
          case 'fetchCombine':
            subThunks.push(next => (payload, dispatch, state) => fetch((task.fetch.host || '') + task.route.path, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              ...task.fetch,
              body: task.send ? JSON.stringify(task.send(payload, state)) : '{}'
            }).then(res => res.json()).then(json => next(json, dispatch, state)));
            break;
          case 'deal':
            subThunks.push(next => (payload, dispatch, state) => {
              task.func(payload, state, dispatch, next);
            });
            break;
          default:
            throw new Error('未知的流动作！');
        }
      }

      let combine = subThunks[subThunks.length - 1](() => console.log('The action', `${type}.${name}.${action}`, 'has been executed.'));
      for (let i = subThunks.length - 2; i >= 0; --i) {
        combine = subThunks[i](combine);
      }
      thunks[`${type}.${name}.${action}`] = payload => (dispatch, getState) => {
        console.log('The action', `${type}.${name}.${action}`, 'will be executed.')
        combine(payload, dispatch, getState());
      };
    }
  }
}

export { thunks, initState, initStateForModels };
