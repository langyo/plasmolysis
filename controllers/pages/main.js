export default ({ setState, dispatch }) => ({
  init: {},
  preLoad: async (context, cookies, params) => {
    try{
      let docs = await context.db.notes.find({}).sort({ date: -1 }).limit(10);
      return { latestPush: docs.map(({ title, content }) => ({ title, content })), latestPushState: 'success' };
    } catch(e) {
      return { latestPush: [], latestPushState: 'fail' };
    }
  }
});