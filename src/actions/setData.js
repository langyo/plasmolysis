export const $ = obj => typeof obj === 'function' ? { type: 'setData', func: obj } : { type: 'setData', obj };

export const client = task => async (payload, dispatch, state, type, name) => {
  console.log('Get payload at setData:', payload);
  dispatch({
    type: 'framework.updateState',
    payload: {
      data: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
    }
  });
  return payload;
};