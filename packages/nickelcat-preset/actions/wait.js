export const $ = length => {
  if (typeof length !== 'number') throw new Error('You must provide a number!');
  return { type: 'wait', length };
};

export const client = task =>
  async (payload, { setState, replaceState, getState, getInitState, dispatcher }, { type, name }) =>
    await (new Promise(resolve =>
      setTimeout(() => resolve(payload, { setState, replaceState, getState, getInitState, dispatcher }, { type, name }), task.length)
    ));
