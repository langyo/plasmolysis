import { generate } from 'shortid';

export default ({ setData, fetch, route, send, handle, createModel, destoryModel, setCookies }) => ({
  submit: [
    fetch({}),
    send((payload, state) => ({ name: payload.name, password: payload.password })),
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
    setData(payload => ({ account: { hasLogin: payload.state === 'success', userName: payload.userName, accessToken: payload.accessToken } })),
    createModel(payload =>({
      name: payload.state === 'success' ? 'successInfoSnackbar' : 'failInfoSnackbar',
      payload: { content: payload.state === 'success' ? '登录成功！' : '登录失败！' }
    })),
    destoryModel(payload => ({ name: 'login', id: payload.$id })),
    setCookies((payload, cookies, data) => ({ userName: payload.userName, accessToken: payload.accessToken }))
  ]
});