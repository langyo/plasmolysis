import { components, actions } from './require';
import { connect } from 'react-redux';
import { thunks } from './thunks';

let dialogs = {}, pages = {}, views = {};

for (let component of Object.keys(components.dialogs)) {
  dialogs[component] = connect(
    (state => ({ ...state.dialogs[component] })),
    (dispatch => Object.keys(actions.dialogs[component]).reduce((prev, action) => (action !== 'init' ? ({
      ...prev,
      [action]: (payload => dispatch(thunks[`dialogs.${component}.${action}`](payload)))
    }) : (prev)), {}))
  )(components.dialogs[component]);
}

for (let component of Object.keys(components.pages)) {
  pages[component] = connect(
    (state => ({ ...state.pages[component] })),
    (dispatch => Object.keys(actions.pages[component]).reduce((prev, action) => (action !== 'init' ? ({
      ...prev,
      [action]: (payload => dispatch(thunks[`pages.${component}.${action}`](payload)))
    }) : (prev)), {}))
  )(components.pages[component]);
}

for (let component of Object.keys(components.views)) {
  views[component] = connect(
    (state => ({ ...state.views[component] })),
    (dispatch => Object.keys(actions.views[component]).reduce((prev, action) => (action !== 'init' ? ({
      ...prev,
      [action]: (payload => dispatch(thunks[`views.${component}.${action}`](payload)))
    }) : (prev)), {}))
  )(components.views[component]);
}

export { dialogs, pages, views };