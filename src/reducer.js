import { handleActions } from 'redux-actions';
import { thunks, initState, initStateForModels } from './thunks';
import { generate } from 'shortid';
import { stringify } from 'query-string';
import configs from '../configs/config';

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

export default handleActions({
  'framework.updateState': (state, action) => merge(state, action.payload),

  'framework.togglePage': (state, action) => {
    history.pushState(
      {},
      typeof configs.title[action.payload.name] === 'string'
        ? configs.title[action.payload.name]
        : configs.title[action.payload.name](state.pages[action.payload.name]),
      `/${action.payload.name}${action.payload.params !== {} ? `?${stringify(action.payload.params)}` : ''}`
    );
    return {
      ...state,
      renderPage: action.payload.name,
      renderPageParams: action.payload.params
    };
  },

  'framework.createModel': (state, action) => {
    let id = generate();
    return merge(state, {
      models: {
        [action.payload.name]: {
          [id]: {
            ...action.payload.payload,
            ...initStateForModels[action.payload.name],
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
  ...initState
});
