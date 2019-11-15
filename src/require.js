let actionDialogsReq = require.context('../actions/dialogs', true, /\.js$/);
let actionPagesReq = require.context('../actions/pages', true, /\.js$/);
let actionViewsReq = require.context('../actions/views', true, /\.js$/);

let actions = { dialogs: {}, pages: {}, views: {} };

actionDialogsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  let pathStr = path.reduce((prev, next) => `${prev}.${next}`);
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = actionDialogsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[pathStr], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  actions.dialogs = dfs(actions.dialogs, 0);
});
actionPagesReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  let pathStr = path.reduce((prev, next) => `${prev}.${next}`);
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = actionPagesReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[pathStr], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  actions.pages = dfs(actions.pages, 0);
});
actionViewsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  let pathStr = path.reduce((prev, next) => `${prev}.${next}`);
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = actionViewsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[pathStr], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  actions.views = dfs(actions.views, 0);
});

const componentDialogsReq = require.context('../components/dialogs', true, /\.js$/);
const componentViewsReq = require.context('../components/views', true, /\.js$/);
const componentPagesReq = require.context('../components/pages', true, /\.js$/);

let components = { dialogs: {}, pages: {}, views: {} };

componentDialogsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = componentDialogsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[path[pos]], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  components.dialogs = dfs(components.dialogs, 0);
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

export { actions, components };
