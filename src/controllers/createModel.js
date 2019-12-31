export default {
  $: (obj1, obj2) => {
    if (typeof obj1 === 'function') {
      return { type: 'createModel', func: obj1 };
    }
    else if (typeof obj1 === 'string') {
      return { type: 'createModel', name: obj1, payload: obj2 === undefined ? {} : obj2 };
    }
    else throw new Error('The first argument must be a function or a string!');
  },
  client: task => async (payload, dispatch, state, type, name) => {
    console.log('Get payload at createModel:', payload);
    if (task.func) {
      let ret = task.func(payload);
      if (!ret.name) throw new Error('You must provide the name of the model!');
      dispatch({ type: 'framework.createModel', payload: ret });
    } else {
      dispatch({ type: 'framework.createModel', payload: { name: task.name, payload: task.payload } });
    }
    return payload;
  }
};