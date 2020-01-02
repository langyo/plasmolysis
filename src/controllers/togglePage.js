export const $ = obj => typeof obj === 'function' ? { type: 'togglePage', func: obj } : { type: 'togglePage', obj };

export const client = task => async (payload, dispatch, state, type, name) => {
  console.log('Get payload at togglePage:', payload);
  dispatch({ type: 'framework.togglePage', payload: task.func ? task.func(payload, state.data) : { name: task.name, params: task.params } });
  return payload;
};