export default {
  title: {
    main: 'I 笔记',
    show: payload => `${payload.title} - I 笔记`,
    edit: payload => `编辑 - ${payload.title} - I 笔记`
  },
  icon: '/favicon.ico',
  initPage: 'main',
  initCookies: {
    userName: '',
    accessToken: ''
  },
  initData: {
    account: {
      hasLogin: false,
      userName: '',
      accessToken: ''
    },
    notes: {
    },
    theme: {
      palette: {
        primary: {
          main: '#3399CC',
        },
        secondary: {
          main: '#66CCFF',
        },
        error: {
          main: red.A400,
        },
        background: {
          default: '#fff',
        }
      }
    }
  },
  language: 'zh-cn'
};