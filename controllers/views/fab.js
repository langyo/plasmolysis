export default ({ dispatch }) => ({
  init: {},
  
  openDrawer: [
    dispatch(payload => ({ type: 'views.drawer.open' }))
  ]
});