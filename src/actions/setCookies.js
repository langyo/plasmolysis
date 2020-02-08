export const $ = obj => typeof obj === 'function' ? { type: 'setCookies', func: obj } : { type: 'setCookies', obj };

export const client = task => async (payload, { setState, replaceState, state, dispatcher }, { type, name }) => {
  console.log('Get payload at setCookies:', payload);
  let cookies = task.func ? task.func(payload, state.data.cookies, state.data) : task.obj;
  setState({
    data: {
      cookies
    }
  });
  Object.keys(cookies).forEach(key =>
    document.cookie = `${key}=${typeof cookies[key] === 'object' || Array.isArray(cookies[key]) ?
      escape(JSON.parse(cookies[key])) :
      escape(cookies[key])}`);
  return payload;
};