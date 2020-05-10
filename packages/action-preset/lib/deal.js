export default {
  creator: func => {
    if (!func) throw new Error('You must provide a function!');
    return { func };
  },
  executor: {
    client: task =>
      async (...args) =>
        await task.func(...args)
  }
};