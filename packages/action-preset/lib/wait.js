export const client = task =>
  async (...args) =>
    await (new Promise(resolve =>
      setTimeout(() => resolve(...args), task.length)
    ));
