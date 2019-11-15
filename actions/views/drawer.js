export default {
  init: {
    isOpen: false,

    isLogin: false,
    userName: ''
  },

  open: $ => $.setState((payload, state) => ({
      isOpen: true
  })),
  close: $ => $.setState((payload, state) => ({
    isOpen: false
  })),

  loginUpdate: $ => $.setState((paylaod, state) => ({
    isLogin: true,
    userName: payload.name
  })),
  logoutUpdate: $ => $.setState((paylaod, state) => ({
    isLogin: false
  })),

  openAboutDialog: $ => $.dispatch(payload => ({ type: 'dialogs.aboutDialog.open' })),
  openLoginDialog: $ => $.dispatch(payload => ({ type: 'dialogs.loginDialog.open' }))
}