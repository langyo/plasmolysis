export const $ = func => {
  if (!func) throw new Error('You must provide a function!');
  return { type: 'deal', func };
};

export const client = task =>
  async (payload, { setState, replaceState, getState, getInitState, dispatcher }, { type, name }) =>
    await task.func(payload, { setState, replaceState, getState, getInitState, dispatcher }, resolve);