export default {
  client: task => async (payload, dispatch, state, type, name) => {
    console.log('Get payload at togglePage:', payload);
    dispatch({ type: 'framework.togglePage', payload: task.func ? task.func(payload, state.data) : { name: task.name, params: task.params } });
    return payload;
  }
};