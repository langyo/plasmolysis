export default {
  title: {
    main: 'I 笔记',
    show: payload => `I 笔记 - ${payload.title}`
  },
  icon: '/favicon.ico',
  initPage: 'main',
  initCookies: {
    userName: '',
    accessToken: ''
  },
  language: 'zh-cn'
};