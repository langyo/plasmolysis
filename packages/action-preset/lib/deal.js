import factory from 'nickelcat/utils/actionFactory';

export default factory({
  $$type: 'deal',
  creator: [
    { paras: ['function'], func: func => ({ func }) }
  ],
  executor: {
    client: [
      task =>
        async (...args) =>
          await task.func(...args)
    ],
    server: [
      task =>
        async (...args) =>
          await task.func(...args)
    ],
    native: [
      task =>
        async (...args) =>
          await task.func(...args)
    ]
  }
});
