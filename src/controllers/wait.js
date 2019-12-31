export default {
  client: task =>
    async (payload, dispatch, state, type, name) =>
      await (new Promise(resolve =>
        setTimeout(() => resolve(payload, dispatch, state), task.length)
      ))
};