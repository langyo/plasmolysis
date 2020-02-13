export default {
  init: payload => {
    return {};
  },
  preload: async (context, cookies, params, renderComponent) => {
    return {
      payload: {},
      extraHeadStr: '',
      extraBodyStr: ''
    };
  }
}
