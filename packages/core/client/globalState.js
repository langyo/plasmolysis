import { generate } from 'shortid';

import createStreamFactory from '../lib/createStream';
import {
  getModelList as getModelListOnStore,
  getInitializer,
  getClientStream
} from '../lib/modelStore';
import deepMerge from '../utils/deepMerge';

let globalState = {};
let modelState = getModelListOnStore().reduce((obj, key) => ({ ...obj, [key]: {} }), {});
let listeners = [];

const updateListener = () => {
  listeners.forEach(setState => setState(() => ({
    modelState,
    globalState
  })));
}

export const getAllState = () => ({ modelState, globalState });

export const clearAllState = () => {
  globalState = {};
  modelState = getModelListOnStore().reduce((obj, key) => ({ ...obj, [key]: {} }), {});
};

export const getState = (modelType, modelID) => {
  // Check the container.
  if (!(modelState[modelType])) modelState[modelType] = {};
  if (!(modelState[modelType][modelID])) modelState[modelType][modelID] = {};

  return modelState[modelType][modelID];
};

export const setState = (modelType, modelID, state) => {
  // Check the container.
  if (!(modelState[modelType])) modelState[modelType] = {};
  if (!(modelState[modelType][modelID])) modelState[modelType][modelID] = {};

  // Check the type.
  if (typeof state !== 'object') throw new Error('You must provide an object!');

  modelState[modelType][modelID] = deepMerge(modelState[modelType][modelID], state);
  updateListener();
};

export const getGlobalState = () => globalState;

export const setGlobalState = state => {
  // Check the type.
  if (typeof state !== 'object') throw new Error('You must provide an object!');

  globalState = deepMerge(globalState, state);
  updateListener();
};

export const getModelList = () => Object.keys(modelState).reduce(
  (obj, key) => ({
    ...obj,
    [key]: Object.keys(modelState[key])
  }), {}
);

export const createModel = (modelType, initState, id = generate()) => {
  // Check the type.
  if (typeof initState !== 'object') throw new Error('You must provide an object!');

  modelState = deepMerge(modelState, {
    [modelType]: {
      [id]: getInitializer(modelType)(initState)
    }
  });
  updateListener();
  return id;
};

export const destoryModel = (modelType, modelID) => {
  modelState = Object.assign({}, {
    ...modelState,
    [modelType]: (Object.keys(modelState[modelType])
      .filter(key => key !== modelID)
      .reduce((obj, key) => ({ ...obj, [key]: modelState[modelType][key] }), {}))
  });
  updateListener();
};

export const evaluateModelAction = async (modelType, modelID, actionName, payload) => {
  modelState = deepMerge(modelState, {
    [modelType]: {
      [modelID]: await createStreamFactory({
        getGlobalState,
        setGlobalState,
        getState,
        setState,
        getModelList,
        createModel,
        destoryModel,
        evaluateModelAction
      }, getActionEvaluator)({
        tasks: getClientStream(modelType)[actionName],
        path: actionName
      }, {
        modelType,
        modelID
      })(payload)
    }
  });
  updateListener();
};

export const registerListener = setState => listeners.push(setState);

