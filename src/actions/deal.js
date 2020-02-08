export const $ = func => {
  if (!func) throw new Error('You must provide a function!');
  return { type: 'deal', func };
};

export const client = task =>
  async (payload, { setState, replaceState, state, dispatcher }, { type, name }) =>
    await task.func(payload, { setState, replaceState, state, dispatcher }, resolve);