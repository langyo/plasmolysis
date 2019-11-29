let controllerModelsReq = require.context('../controllers/models', true, /\.js$/);
let controllerPagesReq = require.context('../controllers/pages', true, /\.js$/);
let controllerViewsReq = require.context('../controllers/views', true, /\.js$/);

let controllers = { models: {}, pages: {}, views: {} };

controllerModelsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  let pathStr = path.reduce((prev, next) => `${prev}.${next}`);
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = controllerModelsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[pathStr], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  controllers.models = dfs(controllers.models, 0);
});
controllerPagesReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  let pathStr = path.reduce((prev, next) => `${prev}.${next}`);
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = controllerPagesReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[pathStr], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  controllers.pages = dfs(controllers.pages, 0);
});
controllerViewsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  let pathStr = path.reduce((prev, next) => `${prev}.${next}`);
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = controllerViewsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[pathStr], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  controllers.views = dfs(controllers.views, 0);
});

const componentModelsReq = require.context('../components/models', true, /\.js$/);
const componentViewsReq = require.context('../components/views', true, /\.js$/);
const componentPagesReq = require.context('../components/pages', true, /\.js$/);

let components = { models: {}, pages: {}, views: {} };

componentModelsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = componentModelsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[path[pos]], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  components.models = dfs(components.models, 0);
});
componentPagesReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = componentPagesReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[path[pos]], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  components.pages = dfs(components.pages, 0);
});
componentViewsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = componentViewsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[path[pos]], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  components.views = dfs(components.views, 0);
});

export { controllers, components };
