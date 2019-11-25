export default ({ setState, dispatch, togglePage }) => ({
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
    dispatch({ type: 'models.about.open' })
  ],
  openLoginDialog: [
    dispatch({ type: 'models.login.open' })
  ],
  openRegisterDialog: [
    dispatch({ type: 'models.register.open' })
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