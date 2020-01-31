import { handleActions } from 'redux-actions';
import { initState } from './thunks';

import merge from '../../utils/deepMerge';

export default (renderPage, {headers, cookies}) => handleActions({ 
  'framework.updateState': (state, action) => merge(state, action.payload),
}, {
  pages: {
    [renderPage]: typeof initState.pages[renderPage] === 'function' ? {} : initState.pages[renderPage]
  },
  views: Object.keys(initState.views).reduce((obj, key) => ({
    ...obj,
    [key]: typeof initState.views[key] === 'function' ? {} : initState.views[key]
  }), {}),
  data: {
    cookies,
    headers
  }
});
