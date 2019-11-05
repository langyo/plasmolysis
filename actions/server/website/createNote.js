export default (channel, sourceType) => channel
  .dispatch(payload => ({ type: sourceType + '.setState', state: 'loading' }))
  .fetch({ host: 'localhost' }, payload => ({ ...payload }))
  .verify((payload, context, allow, disallow) => {
    const { db } = context;
    db.accounts.findOne({ latestToken: payload.token }).exec((err, account) => {
      if (err) {
        disallow();
        return;
      }
      allow();
    })
  })
  .handle((payload, context, reply) => {
    db.accounts.findOne({ latestToken: payload.token }).exec((err, account) => {
      if (err) {
        reply({ state: 'fail', reason: err.toString() });
        return;
      }
      (new db.notes({
        author: account.name,
        body: payload.body
      })).save(err => {
        if (err) {
          reply({ state: 'fail', reason: err.toString() });
          return;
        }
        reply({ state: 'success' })
      })
    })
  })
  .catch((payload, context, reply) => {
    reply({ state: 'fail', reason: 'no permission' });
  })
  .dispatch(payload => ({ type: 'pages.noteEdit.setState', state: payload.state }));