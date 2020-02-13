export default ({ togglePage, dispatch }) => ({
  init: payload => {
    console.log('From server', payload);
    return payload
  },
  preload: async (context, cookies, params) => {
    try{
      let docs = context.db.get('notes').sortBy('date', n => 2147483647 - n.date).take(10);
      return { latestPush: docs, latestPushState: 'success' };
    } catch(e) {
      return { latestPush: [], latestPushState: 'fail' };
    }
  },

  toShowPage: [
    togglePage(payload => ({ name: 'show', params: payload })),
    dispatch('views.fab.toggleToEditFab')
  ],
  toEditPage: [
    togglePage(payload => ({ name: 'edit', params: payload })),
    dispatch('views.fab.toggleToSaveFab')
  ]
});
