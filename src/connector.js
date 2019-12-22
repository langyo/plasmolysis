import { components, controllers } from './require';
import { connect } from 'react-redux';
import store from './store';

let pages = {}, views = {};

// TODO:  添加对未创建 controller 的 component 的默认 dispatch 支持
//        现在虽然已经写了一部分有关于此的代码，但似乎不能正常工作

const models = () => {
  let ret = {};
  for (let component of Object.keys(components.models)) {
    ret[component] = {};
    for (let id of Object.keys(store.getState().models[component])) {
      ret[component][id] = connect(
        (state => ({
          ...state.models[component][id],
          data: state.data,
          $id: id
        })),
        controllers.models[component] && (dispatch => ({
          ...(Object.keys(controllers.models[component]({
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
            handle: () => null,
            wait: () => null,
            setCookies: () => null
          })).reduce((prev, action) => (action !== 'init' ? ({
            ...prev,
            [action]: (payload => dispatch(thunks[`models.${component}.${action}`]({ ...payload, $id: id })))
          }) : (prev)), {})),
          $swap: newIndex => {
            // 搜索新索引编号对应 model 的 id
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
        })) || (dispatch => ({}))
      )(components.models[component]);
    }
  }
  return ret;
};

for (let component of Object.keys(components.pages)) {
  pages[component] = connect(
    (state => ({ ...state.pages[component], data: state.data })),
    controllers.pages[component] && (dispatch => Object.keys(controllers.pages[component]({
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
      handle: () => null,
      wait: () => null,
      setCookies: () => null
    })).reduce((prev, action) => (action !== 'init' ? ({
      ...prev,
      [action]: (payload => dispatch(thunks[`pages.${component}.${action}`](payload)))
    }) : (prev)), {})) || (dispatch => ({}))
  )(components.pages[component]);
}

for (let component of Object.keys(components.views)) {
  views[component] = connect(
    (state => ({ ...state.views[component], data: state.data })),
    controllers.views[component] && (dispatch => Object.keys(controllers.views[component]({
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
      handle: () => null,
      wait: () => null,
      setCookies: () => null
    })).reduce((prev, action) => (action !== 'init' ? ({
      ...prev,
      [action]: (payload => dispatch(thunks[`views.${component}.${action}`](payload)))
    }) : (prev)), {})) || (dispatch => ({}))
  )(components.views[component]);
}

export { models, pages, views };