/// <reference path="type.d.ts" />

import { actionManager as ActionManagerFactory } from 'nickelcat';
const projectPackage: ProjectPackage =
  require('./__nickelcat_staticRequire.js');
const actionManager: ActionManager =
  ActionManagerFactory(projectPackage);
const streamManager: StreamManager =
  actionManager.getContextFactory('webClient')('streamManager');
const stateManager: StateManager =
  actionManager.getContextFactory('webClient')('stateManager');
const modelManager: ModelManager =
  actionManager.getContextFactory('webClient')('modelManager');
const routeManager: RouteManager =
  actionManager.getContextFactory('webClient')('routeManager');

const {
  pageTitle,
  pageName,
  globalState,
  pageState
} = JSON.parse(
  (document.getElementById('nickelcat-server-side-data') as any).value
);
document.getElementById('nickelcat-server-side-data')
  .parentElement.removeChild(document.getElementById('nickelcat-server-side-data'));

import { createElement } from 'react';
import { hydrate, render } from 'react-dom';

function loadReactComponent(
  component: WebClientComponentType,
  modelType: string, modelID: string
) {
  const elementID = `nickelcat-model-${modelID}`;
  hydrate(createElement(component as any, {
    ...stateManager.getState(modelID),
    ...stateManager.getGlobalState(),
    ...streamManager.getStreamList(
      'webClient', modelType
    ).reduce((obj, key) => ({
      ...obj,
      [key]: (payload: { [key: string]: any }) => streamManager.runStream('webClient', modelType, key, payload, {
        modelType,
        modelID
      })
    }), {})
  }), document.getElementById(elementID));
  stateManager.appendListener(() => {
    render(createElement(component as any, {
      ...stateManager.getState(modelID),
      ...stateManager.getGlobalState(),
      ...streamManager.getStreamList(
        'webClient', modelType
      ).reduce((obj, key) => ({
        ...obj,
        [key]: (payload: { [key: string]: any }) => streamManager.runStream('webClient', modelType, key, payload, {
          modelType,
          modelID
        })
      }), {})
    }), document.getElementById(elementID));
  }, modelID);
};

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

stateManager.setGlobalState(globalState);
routeManager.setPageTitle(pageTitle);
routeManager.loadPage(pageName, pageState);