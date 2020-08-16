/// <reference path="type.d.ts" />

import { actionManager as ActionManagerFactory } from 'nickelcat';
const projectPackage: ProjectPackage = require('./__nickelcat_staticRequire.js');
const actionManager: ActionManager = ActionManagerFactory(projectPackage);

const {
  // pageType,
  // globalState,
  // pagePreloadState,
  // pageInfo,
  // viewInfoList,
} = JSON.parse((document.getElementById('nickelcat-server-side-data') as any).value);

import { createElement } from 'react';
import { hydrate, render } from 'react-dom';

const streamManager: StreamManager = actionManager.getContextFactory('webClient')('streamManager');
const stateManager: StateManager = actionManager.getContextFactory('webClient')('stateManager');
const modelManager: ModelManager = actionManager.getContextFactory('webClient')('modelManager');

function loadReactComponent(Component, modelType: string, modelID: string) {
  const elementID = `nickelcat-model-${modelID}`;
  hydrate(createElement(Component, {
    ...stateManager.getState(modelID),
    ...stateManager.getGlobalState(),
    ...streamManager.getStreamList('webClient', modelType).reduce((obj, key) => ({
      ...obj,
      [key]: (payload: { [key: string]: any }) => streamManager.runStream('webClient', modelType, key, payload, {
        modelType,
        modelID
      })
    }), {})
  }), document.getElementById(elementID));
  stateManager.appendListener(() => {
    render(createElement(Component, {
      ...stateManager.getState(modelID),
      ...stateManager.getGlobalState(),
      ...streamManager.getStreamList('webClient', modelType).reduce((obj, key) => ({
        ...obj,
        [key]: (payload: { [key: string]: any }) => streamManager.runStream('webClient', modelType, key, payload, {
          modelType,
          modelID
        })
      }), {})
    }), document.getElementById(elementID));
  }, modelID);
};

// stateManager.setGlobalState({
//   ...globalState,
//   $pageType: pageInfo.pageType,
//   $pageID: stateManager.createModel(pageType, pagePreloadState, pageInfo.id)
// });
// for (const modelType of Object.keys(viewInfoList)) stateManager.createModel(modelType, pagePreloadState, viewInfoList[modelType]);

// Register the listeners and bind the render.
const targetElement = document.getElementById('nickelcat-root');
function appendModel(modelType: string, modelID: string) {
  const elementID = `nickelcat-model-${modelID}`;
  let nodePre = document.createElement('div');
  nodePre.id = elementID;
  targetElement.appendChild(nodePre);
  loadReactComponent(modelManager.loadComponent(modelType), modelType, modelID);
};
function removeModel(modelID: string) {
  const elementID = `nickelcat-model-${modelID}`;
  const node = document.getElementById(elementID);
  targetElement.removeChild(node);
  stateManager.removeListener(modelID);
};

stateManager.appendListener((
  prevIDList: { [modelID: string]: string },
  nextIDList: { [modelID: string]: string }
) => {
  for (const modelID of Object.keys(nextIDList)) {
    if (typeof prevIDList[modelID] === 'undefined') {
      appendModel(nextIDList[modelID], modelID);
    }
  }
  for (const modelID of Object.keys(prevIDList)) {
    if (typeof nextIDList[modelID] === 'undefined') {
      removeModel(modelID);
    }
  }
}, '$$updater');

const modelIDList = stateManager.getModelIDList();
for (const modelID of Object.keys(modelIDList)) {
  const modelType = modelIDList[modelID];
  loadReactComponent(modelManager.loadComponent(modelType), modelType, modelID);
}
