export default ({ setState, dispatch, togglePage, createModel }) => ({
  init: {
    isOpen: false,

    isLogin: false,
    userName: ''
  },

  open: [
    setState({ isOpen: true })
  ],
  close: [
    setState({ isOpen: false })
  ],

  loginUpdate: [
    setState(payload => ({
      isLogin: true,
      userName: payload.name
    }))
  ],
  logoutUpdate: [
    setState({
      isLogin: false
    })
  ],

  openAboutDialog: [
    createModel('about')
  ],
  openLoginDialog: [
    createModel('login')
  ],
  openRegisterDialog: [
    createModel('register')
  ],

  openMainPage: [
    togglePage('main')
  ],
  openEditPage: [
    togglePage('noteEdit')
  ],
  openShowPage: [
    togglePage('noteShow')
  ]
});