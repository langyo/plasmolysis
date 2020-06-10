import { generate } from 'shortid';

import createStreamFactory from '../lib/createStream';
// import {
//   getModelList as getModelListOnStore,
//   getInitializer,
//   getClientStream
// } from '../lib/modelManager';
import deepMerge from '../utils/deepMerge';

class StateManager {
  constructor(modelManager) {
    this.getInitializer = modelManager.getInitializer;
    this.getClientStream = modelManager.getClientStream;

    this.globalState = {};
    this.modelState = modelManager.getModelList().reduce((obj, key) => ({ ...obj, [key]: {} }), {});
    this.listeners = [];
  }

  updateListener() {
    this.listeners.forEach(setState => setState(() => ({
      modelState,
      globalState
    })));
  }

  registerListener(setState) {
    this.listeners.push(setState);
  }

  getAllState() {
    return { modelState: this.modelState, globalState: this.globalState };
  }

  getState(modelType, modelID) {
    // Check the container.
    if (!(this.modelState[modelType])) this.modelState[modelType] = {};
    if (!(this.modelState[modelType][modelID])) this.modelState[modelType][modelID] = {};

    return this.modelState[modelType][modelID];
  };

  setState(modelType, modelID, state) {
    // Check the container.
    if (!(this.modelState[modelType])) this.modelState[modelType] = {};
    if (!(this.modelState[modelType][modelID])) this.modelState[modelType][modelID] = {};

    // Check the type.
    if (typeof state !== 'object') throw new Error('You must provide an object!');

    this.modelState[modelType][modelID] = deepMerge(this.modelState[modelType][modelID], state);
    updateListener();
  };

  getGlobalState() {
    return this.globalState;
  }

  setGlobalState(state) {
    // Check the type.
    if (typeof state !== 'object') throw new Error('You must provide an object!');

    this.globalState = deepMerge(this.globalState, state);
    updateListener();
  };

  getModelList() {
    return Object.keys(this.modelState).reduce(
      (obj, key) => ({
        ...obj,
        [key]: Object.keys(this.modelState[key])
      }), {}
    );
  }

  createModel(modelType, initState, id = generate()) {
    // Check the type.
    if (typeof initState !== 'object') throw new Error('You must provide an object!');

    this.modelState = deepMerge(this.modelState, {
      [modelType]: {
        [id]: getInitializer(modelType)(initState)
      }
    });
    updateListener();
    return id;
  };

  destoryModel(modelType, modelID) {
    this.modelState = Object.assign({}, {
      ...this.modelState,
      [modelType]: (Object.keys(this.modelState[modelType])
        .filter(key => key !== modelID)
        .reduce((obj, key) => ({ ...obj, [key]: this.modelState[modelType][key] }), {}))
    });
    updateListener();
  };

  async evaluateModelAction(modelType, modelID, actionName, payload) {
    this.modelState = deepMerge(this.modelState, {
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
}

export default modelManager => new StateManager(modelManager);
