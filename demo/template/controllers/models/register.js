export default ({ deal, setData, fetch, route, send, handle, createModel, destoryModel }) => ({
  submit: [
    fetch(
      'register',
      (payload, state) => ({ name: payload.name, password: payload.password }),
      (payload, context, replyFunc) => {
        console.log('接收到注册请求：', payload);
        let account = new context.db.accounts(payload);
        account.save(err => {
          if (err) replyFunc({ state: 'fail' });
          else replyFunc({ state: 'success' });
        });
      }
    ),
    setData(payload => ({ hasLogin: payload.state === 'success', userName: payload.userName, accessToken: payload.accessToken })),
    createModel(payload => ({
      name: payload.state === 'success' ? 'successInfoSnackbar' : 'failInfoSnackbar',
      payload: { content: payload.state === 'success' ? '注册成功！' : '注册失败！' }
    })),
    destoryModel(payload => ({ name: 'register', id: payload.$id }))
  ]
});