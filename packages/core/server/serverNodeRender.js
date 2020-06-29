import { createElement } from 'react';
import createStateManager from '../lib/stateManager';
import createStream from './createStream';
import { clientTranslator } from '../lib/translator';

const createReactComponent = (actionManager, stateManager, Component, modelType, modelID) => createElement(Component, {
  ...stateManager.getState(modelType, modelID),
  ...stateManager.getGlobalState(),
  ...((stream => Object.keys(stream).reduce(
    (obj, key) => ({
      ...obj,
      [key]: createStream({ stateManager, actionManager })({
        tasks: stream[key],
        path: `${modelType}[${modelID}]`
      }, {
        modelType,
        modelID
      }, actionManager)
    }), {}
  ))(clientTranslator(stateManager.getClientStream(modelType), actionManager)))
});

export default ({
  actionManager,
  modelManager,
  pageType,
  globalState,
  pagePreloadState
}) => {
  const stateManager = createStateManager(modelManager);
  stateManager.setGlobalState({ ...globalState, $page: pageType });
  stateManager.createModel(pageType, pagePreloadState, '$page');
  for (const modelType of Object.keys(modelManager.getModelList()))
    if (/^views?\./.test(modelType))
      stateManager.createModel(modelType, pagePreloadState, '$view');

  let ret = {};
  for (const modelType of modelManager.getModelList()) {
    for (const modelID of stateManager.getModelIDList(modelType)) {
      ret[`nickelcat-model-${modelType.split('.').join('-')}-${modelID}`] =
        createReactComponent(actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID);
    }
  }

  return ret;
};
