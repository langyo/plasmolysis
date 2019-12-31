export default {
  $: func => {
    if (!func) throw new Error('You must provide a function!');
    return { type: 'deal', func };
  },
  client: task =>
    async (payload, dispatch, state, type, name) =>
      await (new Promise(
        resolve => task.func(payload, dispatch, state, resolve)
      ))
}