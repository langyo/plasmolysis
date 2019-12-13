export default ({ setState, togglePage, createModel, setData, setCookies }) => ({
  init: {
    isOpen: false
  },

  open: [
    setState({ isOpen: true })
  ],
  close: [
    setState({ isOpen: false })
  ],

  loginUpdate: [
    setCookies(payload => ({
      userName: payload.name,
      accessToken: payload.accessToken
    }))
  ],
  logoutUpdate: [
    setCookies(() => ({ userName: '', accessToken: '' })),
    createModel('successInfoSnackbar', { content: '已退出登录' })
  ],

  openAboutDialog: [
    createModel('about'),
    setState({ isOpen: false })
  ],
  openLoginDialog: [
    createModel('login'),
    setState({ isOpen: false })
  ],
  openRegisterDialog: [
    createModel('register'),
    setState({ isOpen: false })
  ],

  openMainPage: [
    togglePage('main'),
    setState({ isOpen: false })
  ],
  openShowPage: [
    togglePage('show'),
    setState({ isOpen: false })
  ]
});