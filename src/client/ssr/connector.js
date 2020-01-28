import { components, controllers, actions } from '../staticRequire';
import { connect } from 'react-redux';

let pages = {}, views = {};

const virtualActions = Object.keys(actions.client)
                        .reduce((obj, key) => ({ ...obj, [key]: () => null }), {});

if (components.pages)
for (let component of Object.keys(components.pages)) {
  pages[component] = connect(
    (state => ({ ...state.pages[component], data: state.data })),
    (dispatch => ({}))
  )(components.pages[component]);
}

if (components.views)
for (let component of Object.keys(components.views)) {
  views[component] = connect(
    (state => ({ ...state.views[component], data: state.data })),
    (dispatch => ({}))
  )(components.views[component]);
}

export { pages, views };
