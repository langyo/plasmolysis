export default ({ setData, fetch, route, send, handle, createModel, destoryModel }) => ({
  init: {},
  submit: [
    fetch({}),
    send(payload => payload),
    route({ path: '/api/note' }),
    handle((payload, context, replyFunc) => {
      console.log('接收到笔记：', payload);
      if(payload.id) {
        
      }
      let note = new context.db.notes(payload);
    })
  ]
})