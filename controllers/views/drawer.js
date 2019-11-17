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

  openAboutDialog: $ => $.dispatch(payload => ({ type: 'models.about.open' })),
  openLoginDialog: $ => $.dispatch(payload => ({ type: 'models.login.open' })),

  openMainPage: $ => $.dispatch(payload => ({ type: 'framework.togglePage', payload: 'main' })),
  openEditPage: $ => $.dispatch(payload => ({ type: 'framework.togglePage', payload: 'noteEdit' })),
  openShowPage: $ => $.dispatch(payload => ({ type: 'framework.togglePage', payload: 'noteShow' }))
}