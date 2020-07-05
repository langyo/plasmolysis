import { createElement } from 'react';
import createStateManager from '../utils/stateManager';
import createStream from './createStream';
import { clientTranslator } from 'nickelcat/translator';

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
      })
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
  const pageInfo = { type: pageType, id: stateManager.createModel(pageType, pagePreloadState)};
  stateManager.setGlobalState({ ...globalState, $pageType: pageType, $pageID: pageInfo.id });
  let viewInfoList = {};
  for (const modelType of modelManager.getModelList())
    if (/^views?\./.test(modelType))
      viewInfoList[modelType] = stateManager.createModel(modelType, pagePreloadState);

  let nodes = {};
  for (const modelType of modelManager.getModelList()) {
    for (const modelID of stateManager.getModelIDList(modelType)) {
      nodes[`nickelcat-model-${modelID}`] =
        createReactComponent(actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID);
    }
  }

  return { nodes, pageInfo, viewInfoList };
};
