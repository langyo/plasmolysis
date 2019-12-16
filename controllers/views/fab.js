export default ({ dispatch, setState, togglePage }) => ({
  init: {
    showFab: 'create'
  },

  openDrawer: [
    dispatch({ type: 'views.drawer.open' })
  ],

  createNewEditor: [
    setState({ showFab: 'save' }),
    togglePage('edit', { })
  ],
  saveEditContent: [
    dispatch({ type: 'pages.edit.submit' })
  ],

  toggleToCreateFab: [
    setState({ showFab: 'create' })
  ],
  toggleToEditFab: [
    setState({ showFab: 'edit' })
  ],
  toggleToSaveFab: [
    setState({ showFab: 'save' })
  ]
})