import React, { createElement, memo, useState } from 'react';
import { hydrate } from 'react-dom';
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

  // Register the listeners and bind the render if running on the browser.
  const targetElement = document.getElementById(targetElementID);
  const appendModel = (modelType, modelID) => {
    const elementID = `nickelcat-model-${modelType.split('.').join('_')}-${modelID}`;
    let nodePre = document.createElement('div');
    nodePre.id = elementID;
    targetElement.appendChild(nodePre);
    const node = document.getElementById(elementID);
    hydrate(bindStateToReact(
      actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID
    ), node);
  };
  const removeModel = (modelType, modelID) => {
    const elementID = `nickelcat-model-${modelType.split('.').join('_')}-${modelID}`;
    const node = document.getElementById(elementID);
    targetElement.removeChild(node);
    stateManager.removeListener(modelID);
  };

  stateManager.registerListener(({ modelState }) => {
    const prevIDList = Array.from(targetElement.childNodes)
      .map(n => n.id)
      .map(str => {
        const ret = /^nickelcat-model-(.+)-(.+)$/.exec(str);
        return { modelType: ret[1], modelID: ret[2] };
      })
      .reduce((obj, { modelType, modelID }) => ({
        ...obj,
        [modelType]: obj[modelType] ? [...obj[modelType], modelID] : [modelID]
      }));
    const nextIDList = Object.keys(modelState).reduce((obj, modelType) => ({
      ...obj,
      [modelType]: Object.keys(modelState[modelType])
    }));

    for (const modelType of Object.keys(nextIDList)) {
      if (!prevIDList[modelType]) {
        for (const modelID of nextIDList[modelType])
          appendModel(modelType, modelID);
      } else {
        for (const modelID of nextIDList[modelType]) {
          if (!prevIDList[modelType][modelID]) appendModel(modelType, modelID);
        }
        for (const modelID of prevIDList[modelType]) {
          if (!nextIDList[modelType][modelID]) removeModel(modelType, modelID);
        }
      }
    }
  });

  for (const modelType of modelManager.getModelList()) {
    if (stateManager.modelState[modelType]) {
      for (const modelID of Object.keys(stateManager.modelState[modelType])) {
        const elementID = `nickelcat-model-${modelType.split('.').join('_')}-${modelID}`;
        hydrate(bindStateToReact(
          actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID
        ), document.getElementById(elementID));
      }
    }
  }
}
