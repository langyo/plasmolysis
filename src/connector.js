import { components, controllers } from './require';
import { connect } from 'react-redux';
import { thunks } from './thunks';
import store from './store';

let pages = {}, views = {};

const models = () => {
  let ret = {};
  for (let component of Object.keys(components.models)) {
    ret[component] = {};
    for(let id of Object.keys(store.getState().models[component])) {
      ret[component][id] = connect(
        (state => ({
          ...state.models[component][id],
          data: state.data,
          $id: id
        })),
        (dispatch => Object.keys(controllers.models[component]({
          deal: () => null,
          togglePage: () => null,
          createModel: () => null,
          destoryModel: () => null,
          setState: () => null,
          setData: () => null,
          dispatch: () => null,
          fetch: () => null,
          send: () => null,
          route: () => null,
          handle: () => null
        })).reduce((prev, action) => (action !== 'init' ? ({
          ...prev,
          [action]: (payload => dispatch(thunks[`models.${component}.${action}`]({ ...payload, $id: id })))
        }) : (prev)), {})),
      )(components.models[component]);
    }
  }
  return ret;
};

for (let component of Object.keys(components.pages)) {
  pages[component] = connect(
    (state => ({ ...state.pages[component], data: state.data })),
    (dispatch => Object.keys(controllers.pages[component]({
      deal: () => null,
      togglePage: () => null,
      createModel: () => null,
      destoryModel: () => null,
      setState: () => null,
      setData: () => null,
      dispatch: () => null,
      fetch: () => null,
      send: () => null,
      route: () => null,
      handle: () => null
    })).reduce((prev, action) => (action !== 'init' ? ({
      ...prev,
      [action]: (payload => dispatch(thunks[`pages.${component}.${action}`](payload)))
    }) : (prev)), {}))
  )(components.pages[component]);
}

for (let component of Object.keys(components.views)) {
  views[component] = connect(
    (state => ({ ...state.views[component], data: state.data })),
    (dispatch => Object.keys(controllers.views[component]({
      deal: () => null,
      togglePage: () => null,
      createModel: () => null,
      destoryModel: () => null,
      setState: () => null,
      setData: () => null,
      dispatch: () => null,
      fetch: () => null,
      send: () => null,
      route: () => null,
      handle: () => null
    })).reduce((prev, action) => (action !== 'init' ? ({
      ...prev,
      [action]: (payload => dispatch(thunks[`views.${component}.${action}`](payload)))
    }) : (prev)), {}))
  )(components.views[component]);
}

export { models, pages, views };