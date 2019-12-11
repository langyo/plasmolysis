export default ({ dispatch, createModel }) => ({
  init: {},
  
  openDrawer: [
    dispatch(payload => ({ type: 'views.drawer.open' }))
  ],

  createNewEditDialog: [
    createModel('editNote')
  ]
})