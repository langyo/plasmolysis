import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

export default ({ setState, fetch, route, send, handle, createModel, destoryModel, togglePage, dispatch, deal }) => ({
  init: payload => ({
    isFetching: false,

    content: payload.content && EditorState.createWithContent(convertFromRaw(JSON.parse(props.content))) || EditorState.createEmpty(),
    title: payload.title || '',
    time: payload.time || Date.now(),
    tags: payload.tags || ['默认收藏夹']
  }),

  setContent: [setState(content => ({ content }))],
  setTitle: [setState(title => ({ title }))],
  setTime: [setState(time => ({ time }))],
  setTags: [setState(tags => ({ tags }))],

  submit: [
    setState({ isFetching: true }),
    fetch(
      'note',
      (payload, state) => ({
        title: state.pages.edit.title,
        time: state.pages.edit.time,
        tags: state.pages.edit.tags,
        content: JSON.stringify(state.pages.edit.content)
      }),
      (payload, context, replyFunc) => {
        console.log('接收到笔记：', payload);
        if (payload.id) {
          db.notes.findById(payload.id, (err, doc) => {
            if (err) {
              console.log(err);
              replyFunc({ state: 'fail', reason: '笔记不存在' });
              return;
            }
            doc.tags = payload.tags;
            doc.content = payload.content;
            doc.title = payload.title;
            doc.tags = payload.tags;
            doc.save();
            replyFunc({ state: 'success', id: payload.id });
          });
        } else {
          if (!payload.tags || !payload.content || !payload.title) {
            replyFunc({ state: 'fail', reason: '请求不完整！' });
            return;
          }
          let note = new context.db.notes({
            tags: payload.tags,
            content: payload.content,
            title: payload.title
          });
          note.save((err, doc) => {
            if (err) {
              console.log(err);
              replyFunc({ state: 'fail', reason: '储存失败' });
              return;
            }
            replyFunc({ state: 'success', id: doc.id });
          })
        }
      }
    ),
    setState({ isFetching: false }),
    createModel(payload => ({
      name: payload.state === 'success' ? 'successInfoSnackbar' : 'failInfoSnackbar',
      payload: { content: payload.state === 'success' ? '已保存' : payload.reason }
    })),
    togglePage('main'),
    dispatch({ type: 'views.fab.toggleToCreateFab' })
  ]
});