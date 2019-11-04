import { handleActions } from 'redux-actions';
import { generate } from 'shortid';

const createPage = (oldState, init) => ({
  ...oldState,
  [generate()]: init
});

const createDialog = (oldState, init) => ({
  ...oldState,
  [generate()]: init
});

const requireTool = {
  path: key => /^\.\/(.*)\.js$/.exec(key)[1].split('/'),
  dfs: (obj, path, requireFunc) => {
    let head = path.shift();
    if (path.length > 0) {
      if (obj[head]) obj[head] = requireTool.dfs(obj[head]);
      else obj[head] = requireTool.dfs({});
    } else {
      obj[head] = requireFunc(key).default;
    }
    return obj;
  }
}

const requireFuncForComponentViews = require.context('../components/views', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForComponentDialogs = require.context('../components/dialogs', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForComponentPages = require.context('../components/pages', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForActionViews = require.context('../actions/views/views', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForActionDialogs = require.context('../actions/views/dialogs', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForActionPages = require.context('../actions/views/pages', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForActionLocal = require.context('../actions/local', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
const requireFuncForActionServer = require.context('../actions/server', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);

let components = {};
let actions = {};

requireFuncForComponentViews.keys().forEach(key => {
  let path = requireTool.path(key);
  components.views = requireTool.dfs(componentView, path, requireFuncForComponentViews);
});
requireFuncForComponentDialogs.keys().forEach(key => {
  let path = requireTool.path(key);
  components.dialogs = requireTool.dfs(componentDialog, path, requireFuncForComponentDialogs);
});
requireFuncForComponentPages.keys().forEach(key => {
  let path = requireTool.path(key);
  components.pages = requireTool.dfs(componentPage, path, requireFuncForComponentPages);
});
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

const initialState = {
  views: {

  },
  data: {

  },
  renderPage: 'main',
  pages: {

  }
};

export default handleActions({
  
}, initialState);
