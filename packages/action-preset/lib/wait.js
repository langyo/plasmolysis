export default {
  creator: length => {
    if (typeof length !== 'number') throw new Error('You must provide a number!');
    return { length };
  },
  executor: {
    client: task =>
      async (...args) =>
        await (new Promise(resolve =>
          setTimeout(() => resolve(...args), task.length)
        ))
  }
};
