export const $ = length => {
  if (typeof length !== 'number') throw new Error('You must provide a number!');
  return { $type: 'wait', length };
};

export const client = task =>
  async (...args) =>
    await (new Promise(resolve =>
      setTimeout(() => resolve(...args), task.length)
    ));
