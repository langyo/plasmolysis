export const $ = obj => typeof obj === 'function' ? { type: 'setState', func: obj } : { type: 'setStates', obj };

export const client = task => async (payload, { setState, replaceState, state, dispatcher }, { type, name }) => {
  console.log('Get payload at setState:', payload);
  if (type !== 'models') setState({
    [type]: {
      [name]: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
    }
  });
  else setState({
    [type]: {
      [name]: {
        [payload.$id]: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
      }
    }
  });
  return payload;
};