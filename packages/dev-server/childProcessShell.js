process.on('message', ({ payload, id, type }) => {
  if (type === 'normal') {
    if (global._nickelcat_loadProcessor) {
      global._nickelcat_loadProcessor(payload).then(payload => {
        process.send({
          payload, id, type
        });
      });
    }
    else throw new Error('Cannot deal the normal package.');
  } else if (type === 'init') {
    eval(payload);
    process.send({ type: 'init' });
  }
});