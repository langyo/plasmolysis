export const $ = length => {
  if (typeof length !== 'number') throw new Error('You must provide a number!');
  return { type: 'wait', length };
};

export default {
  client: task =>
    async (payload, dispatch, state, type, name) =>
      await (new Promise(resolve =>
        setTimeout(() => resolve(payload, dispatch, state), task.length)
      ))
};