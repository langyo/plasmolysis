import { generate } from 'shortid';

import createStreamFactory from './createStream';
import deepMerge from '../utils/deepMerge';

export default modelManager => {
  let getInitializer = modelManager.getInitializer;
  let getClientStream = modelManager.getClientStream;

  let globalState = {};
  let modelState = modelManager.getModelList().reduce((obj, key) => ({ ...obj, [key]: {} }), {});
  let listeners = {};

  const updateListener = () => {
    Object.keys(listeners).forEach(id => listeners[id]());
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
      if (!(modelState[modelType])) modelState[modelType] = {};
      if (!(modelState[modelType][modelID])) modelState[modelType][modelID] = {};

      return modelState[modelType][modelID];
    },

    setState(modelType, modelID, state) {
      // Check the container.
      if (!(modelState[modelType])) modelState[modelType] = {};
      if (!(modelState[modelType][modelID])) modelState[modelType][modelID] = {};

      // Check the type.
      if (typeof state !== 'object') throw new Error('You must provide an object!');

      modelState[modelType][modelID] = deepMerge(modelState[modelType][modelID], state);
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
      return Object.keys(modelState);
    },

    getModelIDList(modelType) {
      if (!modelState[modelType]) modelState[modelType] = {};
      return Object.keys(modelState[modelType]);
    },

    createModel(modelType, initState, id = generate()) {
      // Check the type.
      if (typeof initState !== 'object') throw new Error('You must provide an object!');

      modelState = deepMerge(modelState, {
        [modelType]: {
          [id]: getInitializer(modelType)(initState)
        }
      });
      updateListener();
      return id;
    },

    destoryModel(modelType, modelID) {
      modelState = Object.assign({}, {
        ...modelState,
        [modelType]: (Object.keys(modelState[modelType])
          .filter(key => key !== modelID)
          .reduce((obj, key) => ({ ...obj, [key]: modelState[modelType][key] }), {}))
      });
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
