import { handleActions } from 'redux-actions';
import { thunks, initState, initStateForModels } from './thunks';
import { generate } from 'shortid';
import { stringify } from 'query-string';

import { configs } from '../staticRequire';

const merge = (obj1, obj2) => {
  let ret = { ...obj1 };
  for (let i of Object.keys(obj2)) {
    if (Array.isArray(obj2[i])) {
      ret[i] = Array.prototype.slice.call(obj2[i]);
    }
    else if (typeof ret[i] === 'object' && typeof obj2[i] === 'object') {
      ret[i] = merge(ret[i], obj2[i]);
    }
    else ret[i] = obj2[i];
  };
  return ret;
}

export default preload => handleActions({
  'framework.updateState': (state, action) => merge(state, action.payload),

  'framework.togglePage': (state, action) => {
    history.pushState(
      {},
      configs.title[action.payload.name] ? (typeof configs.title[action.payload.name] === 'string'
        ? configs.title[action.payload.name]
        : configs.title[action.payload.name](state.pages[action.payload.name]),
        `/${action.payload.name}${action.payload.params ? `?${stringify(action.payload.params)}` : ''}`) : 'Unknown Title'
    );
    let params = initState.pages[action.payload.name] && typeof
      initState.pages[action.payload.name] === 'function'
      ? initState.pages[action.payload.name](action.payload.params, state.data)
      : { ...initState.pages[action.payload.name], ...action.payload.params } || action.payload.params || {};
    // TODO: 从客户端请求 preLoad 函数；这并不是必须要加载得，可通过 config 下配置决定各个页面是否要执行
    return {
      ...state,
      pages: {
        ...state.pages,
        [action.payload.name]: {
          ...state.pages[action.payload.name],
          ...params
        }
      },
      renderPage: action.payload.name
    };
  },

  'framework.createModel': (state, action) => {
    let id = generate();
    let params = initStateForModels[action.payload.name] && typeof
      initStateForModels[action.payload.name] === 'function'
      ? initStateForModels[action.payload.name](action.payload.payload)
      : { ...initStateForModels[action.payload.name], ...action.payload.payload } || action.payload.payload || {};
    return merge(state, {
      models: {
        [action.payload.name]: {
          [id]: {
            ...params,
            $id: id
          }
        }
      }
    })
  },

  'framework.destoryModel': (state, action) => {
    return ({
      ...state,
      models: {
        ...state.models,
        [action.payload.name]: Object.keys(state.models[action.payload.name]).reduce((prev, next) => {
          if (next === action.payload.id) return prev;
          else return { ...prev, [next]: state.models[action.payload.name][next] }
        }, {})
      }
    })
  },

  ...thunks
}, {
  ...merge(initState, preload || {})
});
