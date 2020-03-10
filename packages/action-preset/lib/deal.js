export const client = task =>
  async (...args) =>
    await task.func(...args);
