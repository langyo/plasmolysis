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
  language: 'zh-cn'
};