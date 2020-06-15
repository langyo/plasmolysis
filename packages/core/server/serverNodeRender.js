import React, {createElement, memo, useState } from 'react';
import createStateManager from '../lib/stateManager';
import createStream from './createStream';
import { clientTranslator } from '../lib/translator';

const bindStateToReact = (actionManager, stateManager, component, modelType, modelID) => createElement(memo(() => {
  const [state, setState] = useState(stateManager.getAllState());
  stateManager.registerListener(setState, modelID);

  return createElement(memo(component, {
    ...state.modelState[modelType][modelID],
    ...state.globalState,
    ...((stream => Object.keys(stream).reduce(
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
    ))(clientTranslator(stateManager.getClientStream(modelType), actionManager)))
  }));
}));

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
