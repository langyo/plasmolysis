export default {
  $:  obj => {
    if (!obj) throw new Error('You must provide a function or an object!');
    return { type: 'dispatch', obj };
  },
  client: task => async (payload, dispatch, state, type, name) => {
    console.log('Get payload at dispatch:', payload);
    let ret = typeof task.obj === 'function' ? task.obj(payload, state) : task.obj;
    if (/^framework\./.test(ret.type)) {
      if (['togglePage, updateState, createModel, destoryModel'].indexOf(ret.type) < 0)
        throw new Error(`There is no action named ${ret.payload}!`);
      dispatch({ ...ret });
    }
    else {
      if (Object.keys(thunks).indexOf(ret.type) < 0)
        throw new Error(`There is no action named ${ret.payload}!`);
      dispatch(thunks[ret.type](ret.payload));
    };
    return payload;
  }
};