import { controllers } from './require';
import initData from '../configs/initData';

let thunks = {};
let initState = { models: {}, pages: {}, views: {}, data: initData };
let initStateForModels = {};

for (let type of ['models', 'pages', 'views']) {
  for (let name of Object.keys(controllers[type])) {
    // 生成动作表
    let dealed = controllers[type][name]({
      deal: func => {
        if (!func) throw new Error('You must provide a function!');
        return { type: 'deal', func };
      },
      togglePage: (name, params) => {
        if (Object.keys(controllers.pages).indexOf(name) < 0) throw new Error(`No page named ${name}!`);
        return { type: 'togglePage', name, params };
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
        if(!obj.host) obj.host = '';
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
        if(typeof obj === 'function') return { type: 'setCookies', func: obj };
        else if(typeof obj !== 'object') throw new Error('You must provide a function or an object!');
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

    // 对其中每个作为数组存在的元素进行扁平化
    // TODO:  即将加入条件判断
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
      let subThunks = [];

      for (let task of dealed[action]) {
        // TODO:  这里的代码将会被打包成函数，接收的参数有 task，返回一个回调函数 next => (payload, dispatch, state)
        //        实现条件判断时，subThunks 将会带有层级区分
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
                    [name]: {
                      [payload.$id]: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
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
              next(payload, dispatch, state);
            });
            break;
          case 'togglePage':
            subThunks.push(next => (payload, dispatch, state) => {
              dispatch({ type: 'framework.togglePage', payload: { name: task.name, params: task.params } });
              next(payload, dispatch, state);
            });
            break;
          case 'createModel':
            subThunks.push(next => (payload, dispatch, state) => {
              if (task.func) {
                let ret = task.func(payload);
                if (!ret.name) throw new Error('You must provide the name of the model!');
                dispatch({ type: 'framework.createModel', payload: ret });
              } else {
                dispatch({ type: 'framework.createModel', payload: { name: task.name, payload: task.payload } });
              }
              next(payload, dispatch, state);
            });
            break;
          case 'destoryModel':
            subThunks.push(next => (payload, dispatch, state) => {
              if (task.func) {
                let ret = task.func(payload);
                if (!ret.name) throw new Error('You must provide the name of the model!');
                if (!ret.id) throw new Error('You must provide the model id!');
                dispatch({ type: 'framework.destoryModel', payload: ret });
              } else {
                dispatch({ type: 'framework.destoryModel', payload: { name: task.name, id: task.id } });
              }
              next(payload, dispatch, state);
            });
            break;
          case 'fetchCombine':
            subThunks.push(next => (payload, dispatch, state) => fetch(task.fetch.host + task.route.path, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              ...task.fetch,
              body: task.send ? JSON.stringify(task.send(payload, state)) : '{}'
            }).then(res => res.json()).then(json => next({ ...json, $id: payload.$id }, dispatch, state)));
            break;
          case 'deal':
            subThunks.push(next => (payload, dispatch, state) => task.func(payload, dispatch, state, next));
            break;
          case 'wait':
            subThunks.push(next => (payload, dispatch, state) => setTimeout(() => next(payload, dispatch, state), task.length));
            break;
          case 'setCookies':
            subThunks.push(next => (payload, dispatch, state) => {
              dispatch({ type: 'framework.updateState', payload: {
                data: {
                  cookies: task.func ? task.func(payload, state.data.cookies, state.data) : task.obj
                }
              }});
              next(payload, dispatch, state);
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
