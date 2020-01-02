export const $ = obj => typeof obj === 'function' ? { type: 'setState', func: obj } : { type: 'setStates', obj };

export const client = task => async (payload, dispatch, state, type, name) => {
  console.log('Get payload at setState:', payload);
  if (type !== 'models') dispatch({
    type: 'framework.updateState',
    payload: {
      [type]: {
        [name]: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
      }
    }
  });
  else dispatch({
    type: 'framework.updateState',
    payload: {
      [type]: {
        [name]: {
          [payload.$id]: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
        }
      }
    }
  });
  return payload;
};