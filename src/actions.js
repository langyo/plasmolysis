const requireFuncForActionViews = require.context('../actions/views/views', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForActionDialogs = require.context('../actions/views/dialogs', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForActionPages = require.context('../actions/views/pages', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForActionLocal = require.context('../actions/local', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForActionServer = require.context('../actions/server', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);

let actions = { views: {} };

requireFuncForActionViews.keys().forEach(key => {
  let path = requireTool.path(key);
  actions.views.views = requireTool.dfs(actionViews, path, requireFuncForActionViews);
});
requireFuncForActionDialogs.keys().forEach(key => {
  let path = requireTool.path(key);
  actions.views.dialogs = requireTool.dfs(actionViews, path, requireFuncForActionDialogs);
});
requireFuncForActionPages.keys().forEach(key => {
  let path = requireTool.path(key);
  actions.views.pages = requireTool.dfs(actionViews, path, requireFuncForActionPages);
});
requireFuncForActionLocal.keys().forEach(key => {
  let path = requireTool.path(key);
  actions.local = requireTool.dfs(actionLocal, path, requireFuncForActionLocal);
});
requireFuncForActionServer.keys().forEach(key => {
  let path = requireTool.path(key);
  actions.server = requireTool.dfs(actionServer, path, requireFuncForActionServer);
});

const dfsView = (path, obj) => {
  if (typeof obj === 'object') {
    let ret = {};
    for (let i of Object.keys(obj)) {
      let temp = dfsView(path + '.' + i, obj[i]);
      if (typeof temp === 'object') ret = { ...ret, ...temp };
      else ret[path + '.' + i] = temp;
    }
    return ret;
  } else {
    if (typeof obj !== 'function') throw new Error('You must provide a function!');
    return payload => (dispatch, getState) => {
      let state = getState();
      let ret = obj(payload,
        {
          ...state.views,
          data: state.data,
          renderPage: state.renderPage,
          pages: state.pages
        },
        dispatch,
        state => dispatch({
          type: 'framework.updateState',
          state,
          source: 'views.views'
        })
      );
      if (ret) dispatch({
        type: 'framework.updateState',
        state: ret,
        source: 'views.views'
      });
    }
  }
};

actions.views.views = dfsView(actions.views.views);

export default actions;
