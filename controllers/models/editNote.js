export default ({ setState, fetch, route, send, handle, createModel, destoryModel }) => ({
  init: {
    isFetching: false
  },
  submit: [
    setState({ isFetching: true }),
    fetch({}),
    send(payload => payload),
    route({ path: '/api/note' }),
    handle((payload, context, replyFunc) => {
      console.log('接收到笔记：', payload);
      if(payload.id) {
        db.notes.findById(payload.id, (err, doc) => {
          if(err) {
            console.log(err);
            replyFunc({ state: 'fail', reason: '笔记不存在'});
            return;
          }
          doc.tags = payload.tags;
          doc.content = payload.content;
          doc.title = payload.title;
          doc.tags = payload.tags;
          doc.save();
          replyFunc({ state: 'success', id: payload.id});
        });
      } else {
        let note = new context.db.notes({
          tags: payload.tags,
          content: payload.content,
          title: payload.title,
          tags: payload.tags
        });
        note.save((err, doc) => {
          if(err) {
            console.log(err);
            replyFunc({ state: 'fail', reason: '储存失败'});
            return;
          }
          replyFunc({ state: 'success', id: doc.id });
        })
      }
    }),
    setState({ isFeching: false }),
    destoryModel(payload => ({ name: 'editNote', id: payload.$id })),
    createModel(payload =>({
      name: payload.state === 'success' ? 'successInfoSnackbar' : 'failInfoSnackbar',
      payload: { context: payload.state === 'success' ? '已保存' : payload.reason }
    }))
  ]
})