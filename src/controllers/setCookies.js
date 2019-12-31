export default {
  client: task => async (payload, dispatch, state, type, name) => {
    console.log('Get payload at setCookies:', payload);
    let cookies = task.func ? task.func(payload, state.data.cookies, state.data) : task.obj;
    dispatch({
      type: 'framework.updateState', payload: {
        data: {
          cookies
        }
      }
    });
    Object.keys(cookies).forEach(key =>
      document.cookie = `${key}=${typeof cookies[key] === 'object' || Array.isArray(cookies[key]) ?
        escape(JSON.parse(cookies[key])) :
        escape(cookies[key])}`);
    return payload;
  }
};