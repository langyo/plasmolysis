export const $ = length => {
  if (typeof length !== 'number') throw new Error('You must provide a number!');
  return { type: 'wait', length };
};

export const client = task =>
  async (payload, { setState, replaceState, state, dispatcher }, { type, name }) =>
    await (new Promise(resolve =>
      setTimeout(() => resolve(payload, dispatch, state), task.length)
    ));
