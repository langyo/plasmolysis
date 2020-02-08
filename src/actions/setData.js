export const $ = obj => typeof obj === 'function' ? { type: 'setData', func: obj } : { type: 'setData', obj };

export const client = task => async (payload, { setState, replaceState, state, dispatcher }, { type, name }) => {
  console.log('Get payload at setData:', payload);
  setState({
    data: typeof task.obj === 'function' ? task.obj(payload, state) : task.obj
  });
  return payload;
};