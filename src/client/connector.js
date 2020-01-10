import { components, controllers, actions } from '../staticRequire';

import { connect } from 'react-redux';
import store from './store';

let pages = {}, views = {};

const virtualActions = Object.keys(actions.client)
                        .reduce((obj, key) => ({ ...obj, [key]: () => null }), {});

const models = () => {
  let ret = {};
  if (components.models)
  for (let component of Object.keys(components.models)) {
    ret[component] = {};
    for (let id of Object.keys(store.getState().models[component])) {
      ret[component][id] = connect(
        (state => ({
          ...state.models[component][id],
          data: state.data,
          $id: id
        })),
        controllers.models[component] ? (dispatch => ({
          ...(Object.keys(controllers.models[component](virtualActions))
           .reduce((prev, action) => (action !== 'init' ? ({
            ...prev,
            [action]: (payload => dispatch(thunks[`models.${component}.${action}`]({ ...payload, $id: id })))
          }) : (prev)), {})),
          $swap: newIndex => {
            // Search for the id of the model corresponding to the new index number.
            let components = store.getState().models[component];
            let oldIndex = store.getState().models[component][id].$index;
            for(let i of Object.keys(components)) {
              if(components[i].$index === newIndex) {
                dispatch({
                  type: 'framework.updateState',
                  payload: {
                    models: {
                      [i]: {
                        $index: oldIndex
                      },
                      [id]: {
                        $index: newIndex
                      }
                    }
                  }
                })
              }
            }
          },
          $destory: () => dispatch({
            type: 'framework.destoryModel',
            payload: {
              name: component,
              id
            }
          })
        })) : (dispatch => ({}))
      )(components.models[component]);
    }
  }
  return ret;
};

if (components.pages)
for (let component of Object.keys(components.pages)) {
  pages[component] = connect(
    (state => ({ ...state.pages[component], data: state.data })),
    controllers.pages[component] ? (dispatch => Object.keys(controllers.pages[component](virtualActions))
     .reduce((prev, action) => (action !== 'init' ? ({
      ...prev,
      [action]: (payload => dispatch(thunks[`pages.${component}.${action}`](payload)))
    }) : (prev)), {})) : (dispatch => ({}))
  )(components.pages[component]);
}

if (components.views)
for (let component of Object.keys(components.views)) {
  views[component] = connect(
    (state => ({ ...state.views[component], data: state.data })),
    controllers.views[component] ? (dispatch => Object.keys(controllers.views[component](virtualActions))
     .reduce((prev, action) => (action !== 'init' ? ({
      ...prev,
      [action]: (payload => dispatch(thunks[`views.${component}.${action}`](payload)))
    }) : (prev)), {})) : (dispatch => ({}))
  )(components.views[component]);
}

export { models, pages, views };