export const $ = (obj1, obj2) => {
  if (typeof obj1 === 'function') {
    return { type: 'destoryModel', func: obj1 };
  }
  else if (typeof obj1 === 'string') {
    if (!obj2) throw new Error('You must provide the model id!');
    return { type: 'destoryModel', name: obj1, payload: { id: obj2 } };
  }
  else throw new Error('The first argument must be a function or a string!');
}

export const client = task => async (payload, { setState, replaceState, state, dispatcher }, { type, name }) => {
  console.log('Get payload at destoryModel:', payload);
  if (task.func) {
    let ret = task.func(payload);
    if (!ret.name) throw new Error('You must provide the name of the model!');
    if (!ret.id) throw new Error('You must provide the model id!');
    await replaceState({
      ...state,
      models: {
        ...state.models,
        [ret.name]: Object.keys(state.models[ret.name]).filter(n => n !== ret.id).reduce((obj, key) => ({
          ...obj,
          [key]: state.models[ret.name][key]
        }), {})
      }
    });
  } else {
    await replaceState({
      ...state,
      models: {
        ...state.models,
        [task.name]: Object.keys(state.models[task.name]).filter(n => n !== task.id).reduce((obj, key) => ({
          ...obj,
          [key]: state.models[task.name][key]
        }), {})
      }
    });
  }
  return payload;
};