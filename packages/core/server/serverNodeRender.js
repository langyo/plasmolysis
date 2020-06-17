import React from 'react';
import createStateManager from '../lib/stateManager';
import createStream from './createStream';
import { clientTranslator } from '../lib/translator';

const createReactComponent = (actionManager, stateManager, Component, modelType, modelID) => <Component
  {...stateManager.getState(modelType, modelID)}
  {...stateManager.getGlobalState()}
  {...((stream => Object.keys(stream).reduce(
    (obj, key) => ({
      ...obj,
      [key]: createStream(stateManager)({
        tasks: stream[key],
        path: `${modelType}[${modelID}]`
      }, {
        modelType,
        modelID
      }, actionManager)
    }), {}
  ))(clientTranslator(stateManager.getClientStream(modelType), actionManager)))}
/>;

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
        ret[`nickelcat-model-${modelType.split('.').join('_')}-${modelID}`] =
          createReactComponent(actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID);
      }
    }
  }

  return ret;
}
