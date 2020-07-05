import { generate } from 'shortid';

import createStreamFactory from './createStream';
import deepMerge from '../utils/deepMerge';

export default modelManager => {
  let getInitializer = modelManager.getInitializer;
  let getClientStream = modelManager.getClientStream;

  let globalState = {};
  let modelStateRoute = modelManager.getModelList().reduce((obj, key) => ({ ...obj, [key]: [] }), {});
  let prevModelStateRoute = Object.keys(modelStateRoute).reduce((obj, modelType) => ({
    ...obj,
    [modelType]: [...modelStateRoute[modelType]]
  }), {});
  let modelState = {};
  let listeners = {};

  const updateListener = () => {
    if(listeners.$$updater) listeners.$$updater(prevModelStateRoute, modelStateRoute);
    Object.keys(listeners).filter(id => id !== '$$updater').forEach(id => listeners[id]());
    prevModelStateRoute = Object.keys(modelStateRoute).reduce((obj, modelType) => ({
      ...obj,
      [modelType]: [...modelStateRoute[modelType]]
    }), {});
  };

  return Object.seal({
    getInitializer,
    getClientStream,

    registerListener(func, id = generate()) {
      listeners[id] = func;
      return id;
    },

    removeListener(id) {
      if (listeners[id]) delete listeners[id];
    },

    getState(modelType, modelID) {
      // Check the container.
      if (!(modelStateRoute[modelType])) modelStateRoute[modelType] = [];
      if (modelStateRoute[modelType].indexOf(modelID) < 0) modelStateRoute[modelType].push(modelID);
      if (!(modelState[modelID])) modelState[modelID] = {};

      return modelState[modelID];
    },

    setState(modelType, modelID, state) {
      // Check the container.
      if (!(modelStateRoute[modelType])) modelStateRoute[modelType] = [];
      if (modelStateRoute[modelType].indexOf(modelID) < 0) modelStateRoute[modelType].push(modelID);
      if (!(modelState[modelID])) modelState[modelID] = {};

      // Check the type.
      if (typeof state !== 'object') throw new Error('You must provide an object!');

      modelState[modelID] = deepMerge(modelState[modelID], state);
      updateListener();
    },

    getGlobalState() {
      return globalState;
    },

    setGlobalState(state) {
      // Check the type.
      if (typeof state !== 'object') throw new Error('You must provide an object!');

      globalState = deepMerge(globalState, state);
      updateListener();
    },

    getModelList() {
      return Object.keys(modelStateRoute);
    },

    getModelIDList(modelType) {
      if (!modelStateRoute[modelType]) modelStateRoute[modelType] = [];
      return modelStateRoute[modelType];
    },

    createModel(modelType, initState, modelID = generate()) {
      // Check the type.
      if (typeof initState !== 'object') throw new Error('You must provide an object!');
      if (modelManager.getModelList().indexOf(modelType) < 0) throw new Error('You must provide a valid model type!');

      if (!(modelStateRoute[modelType])) modelStateRoute[modelType] = [];
      modelStateRoute[modelType].push(modelID);
      modelState[modelID] = getInitializer(modelType)(initState);

      updateListener();
      return modelID;
    },

    destoryModel(modelType, modelID) {
      if (!(modelStateRoute[modelType])) throw new Error('You must provide a valid model type!');
      if (modelStateRoute[modelType].indexOf(modelID) < 0) throw new Error(`Unknown model ID: ${modelID}`);

      modelStateRoute[modelType].splice(modelStateRoute[modelType].indexOf(modelID), 1);
      delete modelState[modelID];
      updateListener();
    },

    evaluateModelAction: async (modelType, modelID, actionName, payload) => {
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
    }
  });
};
