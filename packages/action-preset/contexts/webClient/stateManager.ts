/// <reference path="../../type.d.ts" />

import { generate } from 'shortid';
import { from, merge, without } from "seamless-immutable";

interface IModelStateRoute {
  [modelType: string]: string[]
};

export interface IGlobalState {
  $pageType?: string,
  $pageID?: string,
  [key: string]: unknown
};

export function stateManager(
  projectPackage: ProjectPackage,
  getContext: GetContextFuncType
): StateManager {
  let globalState: Readonly<{ [key: string]: any }> = from({});
  let modelStateRoute: IModelStateRoute = from({});
  let modelIDMap: { [modelID: string]: string } = from({});
  let prevModelIDMap: { [modelID: string]: string } = from({});
  let modelState: Readonly<{ [key: string]: any }> = from({});

  let listeners: {
    [id: string]: (
      prevModelIDMap: { [modelID: string]: string },
      nextModelIDMap: { [modelID: string]: string }
    ) => void
  } = {};

  function updateListeners() {
    for (const id of Object.keys(listeners)) {
      listeners[id](prevModelIDMap, modelIDMap);
    }
    prevModelIDMap = from(modelIDMap);
  }

  function appendListener(
    func: (
      prevIDList: { [modelID: string]: string },
      nextIDList: { [modelID: string]: string }
    ) => void,
    id: string
  ): void {
    if (typeof listeners[id] !== 'undefined') {
      throw new Error(`The listener '${id}' has already declared.`);
    }
    listeners[id] = func;
  }

  function removeListener(id: string): void {
    if (typeof listeners[id] === 'undefined') {
      throw new Error(`The listener '${id}' doesn't exist.`);
    }
    delete listeners[id];
  }

  function setState(
    modelID: string,
    combineState: { [key: string]: any }
  ): void {
    if (
      typeof modelState[modelID] === 'undefined' ||
      typeof modelIDMap[modelID] === 'undefined'
    ) {
      throw new Error(`The model '${modelID}' doesn't exist.`);
    }
    modelState = merge(modelState, { [modelID]: combineState });
    updateListeners();
  }

  function getState(modelID: string): Readonly<{ [key: string]: any }> {
    if (typeof modelState[modelID] === 'undefined') {
      throw new Error(`The model '${modelID}' doesn't exist.`);
    }
    return from(modelState[modelID]);
  }

  function setGlobalState(combineState: { [key: string]: any }): void {
    globalState = merge(globalState, combineState);
    updateListeners();
  }

  function getGlobalState(): IGlobalState {
    return from(globalState);
  }

  function getModelList(): IModelStateRoute {
    return from(modelStateRoute);
  }

  function getModelIDList(): { [modelID: string]: string } {
    return from(modelIDMap);
  }

  function createModel(
    modelType: string,
    initState?: { [key: string]: any },
    modelID?: string
  ): string {
    if (typeof initState === 'undefined') {
      initState = {};
    }
    if (typeof modelID === 'undefined') {
      modelID = generate();
    }

    if (
      typeof modelState[modelID] !== 'undefined' ||
      typeof modelIDMap[modelID] !== 'undefined'
    ) {
      throw new Error(`The model '${modelID}' has been declared.`);
    }

    modelState = merge(modelState, {
      [modelID]:
        (getContext('streamManager') as StreamManager)
          .runStream(
            'webClient', modelType, '$init', initState, { modelType, modelID }
          )
    });
    modelStateRoute = merge(
      modelStateRoute, { [modelType]: [...modelStateRoute[modelType], modelID] }
    );
    modelIDMap = merge(modelIDMap, { [modelID]: modelType });
    updateListeners();
    return modelID;
  }

  function destoryModel(modelID: string): void {
    if (
      typeof modelState[modelID] === 'undefined' ||
      typeof modelIDMap[modelID] === 'undefined'
    ) {
      throw new Error(`The model '${modelID}' doesn't exist.`);
    }
    modelState = without(modelState, modelID);
    const modelType = modelIDMap[modelID];
    modelStateRoute = merge(
      modelStateRoute,
      { [modelType]: [modelStateRoute[modelType].filter(n => n !== modelID)] }
    );
    modelIDMap = without(modelState, modelID);
    updateListeners();
  }

  function evaluateModelAction(
    modelID: string,
    actionType: string,
    payload: { [key: string]: any }
  ): Readonly<{ [key: string]: any }> {
    if (
      Object.keys(modelState).indexOf(modelID) < 0 ||
      Object.keys(modelIDMap).indexOf(modelID) < 0
    ) {
      throw new Error(`The model '${modelID}' doesn't exist.`);
    }
    const modelType = modelIDMap[modelID];
    return (getContext('streamManager') as StreamManager)
      .runStream(
        'webClient', modelType, actionType, payload, { modelType, modelID }
      );
  }

  const stateManager = Object.freeze({
    getState,
    setState,
    getGlobalState,
    setGlobalState,
    getModelList,
    getModelIDList,
    createModel,
    destoryModel,
    evaluateModelAction,

    appendListener,
    removeListener
  });

  return stateManager;
};
