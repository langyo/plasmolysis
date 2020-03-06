export const $ = func => {
  if (!func) throw new Error('You must provide a function!');
  return { $type: 'deal', func };
};

export const client = task =>
  async (...args) =>
    await task.func(...args);
