import { createAction } from 'redux-actions';
import { thunks } from './thunks';

export default {
  framework: {
    updateState: createAction('framework.updateState', payload => payload),
    togglePage: createAction('framework.togglePage', payload => payload)
  },
  models: Object.keys(thunks.models).reduce((prev, name) => ({
    ...prev,
    [name]: Object.keys(thunks.models[name]).reduce(
      ((prev, action) => ({
        ...prev,
        [/\.(.*)$/.exec(action)[1]]: createAction(/\.(.*)$/.exec(action)[1])
      })), ({ })
    )
  })),
  views: Object.keys(thunks.views).reduce((prev, name) => ({
    ...prev,
    [name]: Object.keys(thunks.views[name]).reduce(
      ((prev, action) => ({
        ...prev,
        [/\.(.*)$/.exec(action)[1]]: createAction(/\.(.*)$/.exec(action)[1])
      })), ({ })
    )
  })),
  pages: Object.keys(thunks.pages).reduce((prev, name) => ({
    ...prev,
    [name]: Object.keys(thunks.pages[name]).reduce(
      ((prev, action) => ({
        ...prev,
        [/\.(.*)$/.exec(action)[1]]: createAction(/\.(.*)$/.exec(action)[1])
      })), ({ })
    )
  }))
};
