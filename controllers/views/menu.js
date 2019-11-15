export default {
  init: {},
  
  openDrawer: $ => $.dispatch(payload => ({ type: 'views.drawer.open' }))
}