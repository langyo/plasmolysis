import { generate } from 'shortid';

export default ({ deal, setState, dispatch, setData, fetch, route, send, handle }) => ({
  init: {
    fetching: false
  },
  submit: [
    setState({ fetching: true }),
    fetch({}),
    send((payload, state) => payload),
    route({ path: '/api/login' }),
    handle((payload, context, replyFunc) => {
      console.log('接收到登录请求：', payload);
      context.db.accounts.findOne(payload).exec((err, doc) => {
        if (doc) {
          let token = generate();
          doc.accessToken = token;
          doc.save();
          replyFunc({ state: 'success', userName: payload.name, accessToken: token });
        }
        else replyFunc({ state: 'fail' });
      });
    }),
    setState(() => ({ fetching: false })),
    setData(payload => ({ hasLogin: payload.state === 'success', userName: payload.userName, accessToken: payload.accessToken })),
    deal((payload, dispatch, state, next) => {
      console.log(payload);
      next(payload);
    })
  ]
});