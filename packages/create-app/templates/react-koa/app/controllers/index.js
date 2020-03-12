import {
  setState
} from 'nickelcat-action-preset';

export default {
  init: () => ({
    count: 1
  }),

  increase: [
    setState((payload, { getState }) => ({ count: getState().count + 1 }))
  ],
  decrease: [
    setState((payload, { getState }) => ({ count: getState().count - 1 }))
  ]
};
