export default ({ setState, togglePage, createModel, setData }) => ({
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
    }),
    setData({
      account: {
        hasLogin: false,
        userName: '',
        accessToken: ''
      }
    })
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