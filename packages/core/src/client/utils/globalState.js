import { generate } from 'shortid';

import createStream from './createStream';
import {
  getModelList as getModelListOnStore,
  getInitializer,
  getStream
} from './modelStore';
import deepMerge from './deepMerge';

let globalState = {};
let modelState = getModelListOnStore().reduce((obj, key) => ({ ...obj, [key]: {}}), {});
let listeners = [];

const updateListener = () => {
  listeners.forEach(setState => setState(() => ({
    modelState,
    globalState
  })));
} 

export const getAllState = () => ({ modelState, globalState });

export const getState = (modelType, modelID) => {
  // Check the container.
  if (!(modelState[modelType])) modelState[modelType] = {};
  
  if (!(modelState[modelType][modelID])) throw new Error(`The model ${modelType}[${modelID}] is missing.`);

  return modelState[modelType][modelID];
}; 

export const setState = (modelType, modelID, state) => {
  // Check the container.
  if (!(modelState[modelType])) modelState[modelType] = {};
  
  if (!(modelState[modelType][modelID])) throw new Error(`The model ${modelType}[${modelID}] is missing.`);
  
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
  modelState = dedepMerge(modelState, {
    [modelType]: {
      [modelID]: null
    }
  });
  updateListener();
};

export const evaluateModelAction = async (modelType, modelID, actionName, payload) => {
  modelState = deepMerge(modelState, {
    [modelType]: {
      [modelID]: await createStream({
        tasks: getStream(modelType)[actionName],
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

