import React, { createElement } from 'react';
import { hydrate as clientRenderFunc } from 'react-dom';
import { renderToString as serverRenderFunc } from 'react-dom/server';
import createStateManager from './stateManager';
import createModelManager from '../lib/modelManager';
import createStream from './createStream';
import { clientTranslator } from '../lib/translator';

const bindStateToReact = (stateManager, component, propsFunc) => class extends Component {
  constructor(props) {
    super(props);
    this.state = stateManager.getAllState();
    stateManager.registerListener(this.setState.bind(this));
  }

  render() {
    return <>
      {createElement(component, propsFunc(this.state))}
    </>
  }
}

export const hydrate = ({
  components,
  rootModelName = 'index',
  pageType,
  globalState,
  pagePreloadState,
  targetElement = document.querySelector('#nickelcat-root')
}) => {
  const rootComponent = components[rootModelName] && components[rootModelName].component || (({ $models }) => (<>{$models}</>));
  const rootController = components[rootModelName] && components[rootModelName].controller || {};

  const modelManager = createModelManager();
  for (const component of components) modelManager.loadComponent(component);

  const stateManager = createStateManager(modelManager);
  stateManager.setGlobalState({ ...globalState, $page: pageType });
  stateManager.setState(pageType, '$page', pagePreloadState);
  stateManager.createModel('$view', pagePreloadState, '$view');

  clientRenderFunc(bindStateToReact(stateManager, rootComponent, state => ({
    ...state.modelState.$view.$view,
    ...state.globalState,
    ...((stream => Object.keys(stream).reduce(
      (obj, key) => ({
        ...obj,
        [key]: createStream({
          tasks: stream[key],
          path: '$view'
        }, {
          modelType: '$view',
          modelID: '$view'
        })
      }), {}
    ))(clientTranslator(rootController))),
    $models: (<div id='nickelcat-models'></div>)
  })), targetElement);

  const appendModel = (modelType, modelID) => {
    const elementID = `nickelcat-model-${modelType}-${modelID}`;
    let node = document.createElement('div');
    node.id = elementID;
    targetElement.appendChild(node);
    const subTargetElement = document.querySelector(elementID);
    clientRenderFunc(bindStateToReact(stateManager, loadComponent(modelType), state => ({
      ...state.modelState[modelType][modelID],
      ...state.globalState,
      ...((stream => Object.keys(stream).reduce(
        (obj, key) => ({
          ...obj,
          [key]: createStream({
            tasks: stream[key],
            path: `${modelType}[${modelID}]`
          }, {
            modelType,
            modelID
          })
        }), {}
      ))(getClientStream(modelType)))
    })), subTargetElement);
  };
  const removeModel = (modelType, modelID) => {
    const elementID = `nickelcat-model-${modelType}-${modelID}`;
    const node = document.querySelector(elementID);
    targetElement.removeChild(node);
  };

  for (const modelType of modelManager.getModelList()) {
    if (stateManager.modelState[modelType]) {
      for (const modelID of Object.keys(stateManager.modelState[modelType])) {
        appendModel(modelType, modelID);
      }
    }
  }

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
}
export const renderToString = ({
  components,
  rootModelName = 'index',
  pageType,
  globalState,
  pagePreloadState,
  targetElement = document.querySelector('#nickelcat-root')
}) => {
  const rootComponent = components[rootModelName] && components[rootModelName].component || (({ $models }) => (<>{$models}</>));
  const rootController = components[rootModelName] && components[rootModelName].controller || {};

  const modelManager = createModelManager();
  for (const component of components) modelManager.loadComponent(component);

  const stateManager = createStateManager(modelManager);
  stateManager.setGlobalState({ ...globalState, $page: pageType });
  stateManager.setState(pageType, '$page', pagePreloadState);
  stateManager.createModel('$view', pagePreloadState, '$view');

  let renderString = serverRenderFunc(bindStateToReact(stateManager, rootComponent, state => ({
    ...state.modelState.$view.$view,
    ...state.globalState,
    ...((stream => Object.keys(stream).reduce(
      (obj, key) => ({
        ...obj,
        [key]: createStream({
          tasks: stream[key],
          path: '$view'
        }, {
          modelType: '$view',
          modelID: '$view'
        })
      }), {}
    ))(clientTranslator(rootController))),
    $models: (<div id='nickelcat-models'></div>)
  })));

  const reg = /<div id='nickelcat-models'.*?>/;
  reg.exec(renderString);
  const insertPos = reg.lastIndex;

  const appendModel = (modelType, modelID) => {
    return serverRenderFunc(bindStateToReact(stateManager, loadComponent(modelType), state => ({
      ...state.modelState[modelType][modelID],
      ...state.globalState,
      ...((stream => Object.keys(stream).reduce(
        (obj, key) => ({
          ...obj,
          [key]: createStream({
            tasks: stream[key],
            path: `${modelType}[${modelID}]`
          }, {
            modelType,
            modelID
          })
        }), {}
      ))(getClientStream(modelType)))
    })));
  };

  for (const modelType of modelManager.getModelList()) {
    if (stateManager.modelState[modelType]) {
      for (const modelID of Object.keys(stateManager.modelState[modelType])) {
        renderString = renderString.split(0, insertPos) + appendModel(modelType, modelID) + renderString.split(insertPos);
      }
    }
  }

  return renderString;
};
