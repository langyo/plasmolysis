import { generate as generateID } from 'shortid';
import { sha256 as sha } from 'sha.js';
import { SchemaModel, StringType } from 'schema-typed';

export default ({ dispatch, setData, fetch, route, send, handle, createModel, destoryModel, setCookies }) => ({
  submit: [
    fetch(
      'login',
      (payload, state) => ({ name: payload.name, password: shajs().update(payload.password).digest('hex') }),
      (payload, context, replyFunc) => {
        console.log('Got login request:', payload);
        
        // Verify
        const schema = SchemaModel({
          name: StringType().isRequired(),
          password: StringType().isRequired()
        });
        const schemaResult = schema.check(payload);
        for (let key of Object.keys(schemaResult)) {
          if (schemaResult[key].hasError) {
            replyFunc({ state: 'fail', reason: 'Illegal data' });
            return;
          }
        }

        // Check the account and write the token
        let account = context.db.get('accounts').find({ name: payload.name }).value();
        if (!account) {
          replyFunc({ state: 'fail', reason: 'Unknown account' });
          return;
        }
        if (account.password !== payload.password) {
          replyFunc({ state: 'fail', reason: 'Wrong password' });
          return;
        }
        let accessToken = generateID();
        context.db.get('accounts').find(payload).assign({ ...account, accessToken }).write().then(() =>
          replyFunc({ state: 'success', userName: payload.name, accessToken })
        );
      }),
    setData(payload => ({ account: { hasLogin: payload.state === 'success', userName: payload.userName, accessToken: payload.accessToken } })),
    createModel(payload => ({
      name: payload.state === 'success' ? 'successInfoSnackbar' : 'failInfoSnackbar',
      payload: { content: payload.state === 'success' ? '登录成功！' : '登录失败！' }
    })),
    destoryModel(payload => ({ name: 'login', id: payload.$id })),
    dispatch(payload => ({
      type: 'views.drawer.loginUpdate',
      payload: {
        userName: payload.userName,
        accessToken: payload.accessToken
      }
    }))
  ]
});
