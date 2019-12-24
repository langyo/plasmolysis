export default ({ setState, togglePage, createModel, setData, setCookies, dispatch }) => ({
  init: {
    isOpen: false
  },

  open: [
    setState({ isOpen: true })
  ],
  close: [
    setState({ isOpen: false })
  ],

  openAboutDialog: [
    createModel('about'),
    setState({ isOpen: false })
  ]
});