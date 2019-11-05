export default {
  openDrawer: (payload, oldState) => ({
    views: {
      drawerOpen: true
    },
    page: {}
  }),
  closeDrawer: (payload, oldState, dispatch, updateState) => {
    dispatch({ type: 'framework.createDialog' , payload: { name: 'about' } });
    updateState({
      views: {
        drawerOpen: false
      }
    });
  }
}