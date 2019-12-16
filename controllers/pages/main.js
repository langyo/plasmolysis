export default ({ togglePage, dispatch }) => ({
  init: payload => {
    console.log('From server', payload);
    return payload
  },
  preLoad: async (context, cookies, params) => {
    try{
      let docs = await context.db.notes.find({}).sort({ date: -1 }).limit(10);
      return { latestPush: docs.map(({ title, content }) => ({ title, content })), latestPushState: 'success' };
    } catch(e) {
      return { latestPush: [], latestPushState: 'fail' };
    }
  },

  toShowPage: [
    togglePage(payload => ({ name: 'show', params: payload })),
    dispatch({ type: 'views.fab.toggleToEditFab' })
  ],
  toEditPage: [
    togglePage(payload => ({ name: 'edit', params: payload })),
    dispatch({ type: 'views.fab.toggleToSaveFab' })
  ]
});