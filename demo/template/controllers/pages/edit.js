import { SchemaModel, StringType, NumberType, ArrayType } from 'schema-typed';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { generate as generateID } from 'shortid';

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
        console.log('Got note: ', payload);

        // Verify
        const schema = SchemaModel({
          id: NumberType(),
          owner: StringType().isRequired(),
          title: StringType().isRequired(),
          content: StringType().isRequired(),
          tags: ArrayType().of(StringType()),
          date: NumberType()
        });
        const schemaResult = schema.check(payload);
        for (let key of Object.keys(schemaResult)) {
          if (schemaResult[key].hasError) {
            replyFunc({ state: 'fail', reason: 'Illegal data' });
            return;
          }
        }

        // Write
        if (payload.id) {
          let note = db.get('notes').find({ id: payload.id }).value();
          if (!note) {
            replyFunc({ state: 'fail', reason: 'Note does not exist' });
            return;
          }
          db.get('notes').find({ id: payload.id }).assign({ 
            tags: payload.tags,
            content: payload.content,
            title: payload.title
          }).write().then(() => replyFunc({ state: 'success', id: payload.id })
          );
        } else {
          let id = generateID();
          context.db.get('notes').push({
            id,
            tags: payload.tags,
            content: payload.content,
            title: payload.title,
            owner: payload.owner
          }).write().then(() =>
            replyFunc({ state: 'success', id })
          );
        }
      }
    ),
    setState({ isFetching: false }),
    createModel(payload => ({
      name: payload.state === 'success' ? 'successInfoSnackbar' : 'failInfoSnackbar',
      payload: { content: payload.state === 'success' ? '已保存' : payload.reason }
    })),
    togglePage('main'),
    dispatch('views.fab.toggleToCreateFab')
  ]
});
