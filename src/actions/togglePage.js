export const $ = obj => typeof obj === 'function' ? { type: 'togglePage', func: obj } : { type: 'togglePage', obj };

export const client = task => async (payload, { setState, replaceState, getState, getInitState, dispatcher }, { type, name }) => {
  console.log('Get payload at togglePage:', payload);
  let ret = task.func ? task.func(payload, getState().data) : { name: task.name, params: task.params };

  history.pushState(
    {},
    configs.title[ret.name] ? (typeof configs.title[ret.name] === 'string'
      ? configs.title[ret.name]
      : configs.title[ret.name](state.pages[ret.name]),
      `/${ret.name}${ret.params ? `?${stringify(ret.params)}` : ''}`) : 'Unknown Title'
  );
  let params = getInitState().pages[ret.name] && typeof
    getInitState().pages[ret.name] === 'function'
    ? getInitState().pages[ret.name](ret.params, state.data)
    : { ...getInitState().pages[ret.name], ...ret.params } || ret.params || {};

  // TODO: 从客户端请求 preload 函数；这并不是必须要加载得，可通过 config 下配置决定各个页面是否要执行

  setState({
    pages: {
      [ret.name]: {
        ...params
      }
    },
    renderPage: ret.name
  });

  return payload;
};