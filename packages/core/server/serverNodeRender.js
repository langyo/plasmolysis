import React, { createElement } from 'react';
import createStateManager from '../lib/stateManager';
import { clientTranslator } from '../lib/translator';

const bindStateToReact = (actionManager, stateManager, component, modelType, modelID) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = stateManager.getAllState();
      stateManager.registerListener(this.setState.bind(this), modelID);
    }

    render() {
      return createElement(component, {
        ...this.state.modelState[modelType][modelID],
        ...this.state.globalState,
        ...((stream => Object.keys(stream).reduce(
          (obj, key) => ({
            ...obj,
            [key]: () => {}
          }), {}
        ))(clientTranslator(stateManager.getClientStream(modelType), actionManager)))
      });
    }
  };
};

export default ({
  actionManager,
  modelManager,
  pageType,
  globalState,
  pagePreloadState,
  targetElementID = 'nickelcat-root'
}) => {
  const stateManager = createStateManager(modelManager);
  stateManager.setGlobalState({ ...globalState, $page: pageType });
  stateManager.createModel(pageType, pagePreloadState, '$page');
  for (const modelType of Object.keys(modelManager.getModelList()))
    if (/^views?\./.test(modelType))
      stateManager.createModel(modelType, pagePreloadState, '$view');

  let ret = {};
  for (const modelType of modelManager.getModelList()) {
    if (stateManager.modelState[modelType]) {
      for (const modelID of Object.keys(stateManager.modelState[modelType])) {
        ret[`nickelcat-model-${modelType.split('.').join('_')}-${modelID}`] = bindStateToReact(
          actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID
        );
      }
    }
  }

  return ret;
}
