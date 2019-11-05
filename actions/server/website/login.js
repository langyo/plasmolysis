import { generate } from 'shortid';

export default (channel, sourceType) => channel
  .dispatch(payload => ({ type: 'views.loginState', state: 'loading' }))
  .fetch({ host: 'localhost' }, payload => ({ ...payload }))
  .verify((payload, context, allow, disallow) => {
    const { db } = context;
    db.accounts.findOne({ name: payload.name }).exec((err, account) => {
      if (err) {
        disallow();
        return;
      }
      if(account.password !== payload.password) {
        disallow();
        return;
      }
      allow();
    })
  })
  .handle((payload, context, reply) => {
    db.accounts.findOne({ name: payload.name }).exec((err, account) => {
      if (err) {
        reply({ state: 'fail', reason: err.toString() });
        return;
      }
      let token = generate();
      account.token = token;
      account.save(err => {
          if(err) {
            reply({ state: 'fail', reason: err.toString() });
            return;
          }
          reply({ state: 'success', token });
      })
    })
  })
  .catch((payload, context, reply) => {
    reply({ state: 'fail', reason: 'no user or the wrong password' });
  })
  .dispatch(payload => ({ type: 'views.loginState', state: payload.state, token: payload.token }));