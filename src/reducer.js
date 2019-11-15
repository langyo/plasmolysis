import { handleActions } from 'redux-actions';
import { thunks, initState } from './thunks';

export default handleActions({
  'framework.updateState': (state, action) => {
    const merge = (obj1, obj2) => {
      let ret  = {...obj1};
      for(let i of Object.keys(obj2)) {
        if(Array.isArray(obj2[i])) {
          ret[i] = Array.prototype.slice.call(obj2[i]);
        }
        else if(typeof ret[i] === 'object' && typeof obj2[i] === 'object') {
          ret[i] = merge(ret[i], obj2[i]);
        }
        else ret[i] = obj2[i];
      };
      return ret;
    }
    return merge(state, action.payload);
  },

  'framework.togglePage': (state, action) => ({
    ...state,
    renderPage: action.payload
  }),
  
  ...thunks
}, {
  ...initState,
  renderPage: 'main' // 这里应当作为配置文件提供比较好
});
