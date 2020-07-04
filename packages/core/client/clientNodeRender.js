import { createElement } from 'react';
import { hydrate, render } from 'react-dom';
import createStateManager from '../lib/stateManager';
import createStream from './createStream';
import { clientTranslator } from '../lib/translator';

const loadReactComponent = (actionManager, stateManager, Component, modelType, modelID) => {
  const elementID = `nickelcat-model-${modelID}`;
  hydrate(createElement(Component, {
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
  }), document.getElementById(elementID));
  stateManager.registerListener(() => {
    render(createElement(Component, {
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
    }), document.getElementById(elementID));
  }, modelID);
};

export default ({
  actionManager,
  modelManager,
  pageType,
  globalState,
  pagePreloadState,
  pageInfo,
  viewInfoList,
  targetElementID = 'nickelcat-root'
}) => {
  const stateManager = createStateManager(modelManager);
  stateManager.setGlobalState({
    ...globalState,
    $pageType: pageInfo.pageType,
    $pageID: stateManager.createModel(pageType, pagePreloadState, pageInfo.id)
  });
  for (const modelType of Object.keys(viewInfoList)) stateManager.createModel(modelType, pagePreloadState, viewInfoList[modelType]);

  // Register the listeners and bind the render.
  const targetElement = document.getElementById(targetElementID);
  const appendModel = (modelType, modelID) => {
    const elementID = `nickelcat-model-${modelID}`;
    let nodePre = document.createElement('div');
    nodePre.id = elementID;
    targetElement.appendChild(nodePre);
    loadReactComponent(actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID);
  };
  const removeModel = (modelType, modelID) => {
    const elementID = `nickelcat-model-${modelID}`;
    const node = document.getElementById(elementID);
    targetElement.removeChild(node);
    stateManager.removeListener(modelID);
  };

  stateManager.registerListener((prevIDList, nextIDList) => {
    for (const modelType of Object.keys(nextIDList)) {
      if (!prevIDList[modelType]) {
        for (const modelID of nextIDList[modelType])
          appendModel(modelType, modelID);
      } else {
        for (const modelID of nextIDList[modelType]) {
          if (prevIDList[modelType].indexOf(modelID) < 0) appendModel(modelType, modelID);
        }
        for (const modelID of prevIDList[modelType]) {
          if (nextIDList[modelType].indexOf(modelID) < 0) removeModel(modelType, modelID);
        }
      }
    }
  }, '$$updater');

  for (const modelType of modelManager.getModelList()) {
    for (const modelID of stateManager.getModelIDList(modelType)) {
      loadReactComponent(actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID);
    }
  }
};
