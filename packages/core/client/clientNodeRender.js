import { createElement } from 'react';
import { hydrate, render } from 'react-dom';
import createStateManager from '../lib/stateManager';
import createStream from './createStream';
import { clientTranslator } from '../lib/translator';

const loadReactComponent = (actionManager, stateManager, Component, modelType, modelID) => {
  const elementID = `nickelcat-model-${modelType.split('.').join('-')}-${modelID}`;
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
        }, actionManager)
      }), {}
    ))(clientTranslator(stateManager.getClientStream(modelType), actionManager)))
  }), document.getElementById(elementID));
  stateManager.registerListener(({ globalState, modelState }) => {
    render(createElement(Component, {
      ...modelState[modelType][modelID],
      ...globalState,
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
    }), document.getElementById(elementID));
  }, modelID);
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
  for (const modelType of modelManager.getModelList())
    if (/^views?\./.test(modelType))
      stateManager.createModel(modelType, pagePreloadState, '$view');

  // Register the listeners and bind the render.
  const targetElement = document.getElementById(targetElementID);
  const appendModel = (modelType, modelID) => {
    const elementID = `nickelcat-model-${modelType.split('.').join('-')}-${modelID}`;
    let nodePre = document.createElement('div');
    nodePre.id = elementID;
    targetElement.appendChild(nodePre);
    loadReactComponent(actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID);
  };
  const removeModel = (modelType, modelID) => {
    const elementID = `nickelcat-model-${modelType.split('.').join('-')}-${modelID}`;
    const node = document.getElementById(elementID);
    targetElement.removeChild(node);
    stateManager.removeListener(modelID);
  };

  stateManager.registerListener(({ modelState }) => {
    const prevIDList = Array.from(targetElement.children)
      .map(n => n.id)
      .map(str => {
        const ret = /^nickelcat-model-(.+)-(.+)$/.exec(str);
        return { modelType: ret[1].split('-').join('.'), modelID: ret[2] };
      })
      .reduce((obj, { modelType, modelID }) => ({
        ...obj,
        [modelType]: obj[modelType] ? [...obj[modelType], modelID] : [modelID]
      }), {});
    const nextIDList = Object.keys(modelState)
      .filter(modelType => Object.keys(modelState[modelType]).length > 0)
      .reduce((obj, modelType) => ({
        ...obj,
        [modelType]: Object.keys(modelState[modelType])
      }), {});

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
    for (const modelID of stateManager.getModelIDList(modelType)) {
      loadReactComponent(actionManager, stateManager, modelManager.loadComponent(modelType), modelType, modelID);
    }
  }
};
