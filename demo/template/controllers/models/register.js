import { SchemaModel, StringType } from 'schema-typed';
import { sha256 as sha } from 'sha.js';

export default ({ deal, setData, fetch, route, send, handle, createModel, destoryModel }) => ({
  submit: [
    fetch(
      'register',
      (payload, state) => ({ name: payload.name, password: sha().update(payload.password).digest('hex') }),
      (payload, context, replyFunc) => {
        console.log('Got register request:', payload);

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

        // Write
	context.db.get('accounts').push({
          name: payload.name,
          password: payload.password
        }).write.then(() => replyFunc({ state: 'success' }));
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
