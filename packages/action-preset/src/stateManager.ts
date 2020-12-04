import {
  runRuntime,
  registerVariantsGenerator
} from 'nickelcat/runtimeManager';

export interface IGlobalState {
  [key: string]: unknown
};

interface IModelStateRoute {
  [modelType: string]: string[]
};

type IListenerFunc = (diff: ({
  type: string,
  id: string,
  type: 'create' | 'change' | 'remove'
})[]) => void;

import { generate } from 'shortid';

// TODO - Check the logic.
let globalState: Readonly<{ [key: string]: any }> = {};
let modelStateRoute: IModelStateRoute = {};
let modelIDMap: { [modelID: string]: string } = {};
let prevModelIDMap: { [modelID: string]: string } = {};
let modelState: Readonly<{ [key: string]: any }> = {};

let listeners: {
  [id: string]: (
    prevModelIDMap: { [modelID: string]: string },
    nextModelIDMap: { [modelID: string]: string }
  ) => void
} = {};

export function updateListeners() {
  for (const id of Object.keys(listeners)) {
    listeners[id](prevModelIDMap, modelIDMap);
  }
  prevModelIDMap = { ...modelIDMap };
}

export function appendListener(
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

export function removeListener(id: string): void {
  if (typeof listeners[id] === 'undefined') {
    throw new Error(`The listener '${id}' doesn't exist.`);
  }
  delete listeners[id];
}

export function setState(
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

export function getState(modelID: string): Readonly<{ [key: string]: any }> {
  if (typeof modelState[modelID] === 'undefined') {
    throw new Error(`The model '${modelID}' doesn't exist.`);
  }
  return { ...modelState[modelID] };
}

export function setGlobalState(combineState: { [key: string]: any }): void {
  globalState = merge(globalState, combineState);
  updateListeners();
}

export function getGlobalState(): IGlobalState {
  return { ...globalState };
}

export function getModelList(): IModelStateRoute {
  return { ...modelStateRoute };
}

export function getModelIDList(): { [modelID: string]: string } {
  return { ...modelIDMap };
}

export function createModel(
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

  modelState = {
    ...modelState,
    [modelID]: runRuntime(
      modelType, 'init', initState, { modelType, modelID }
    )
  };
  modelStateRoute = {
    ...modelStateRoute, [modelType]: [...modelStateRoute[modelType], modelID]
  };
  modelIDMap = { ...modelIDMap, [modelID]: modelType };
  updateListeners();
  return modelID;
}

export function destoryModel(modelID: string): void {
  if (
    typeof modelState[modelID] === 'undefined' ||
    typeof modelIDMap[modelID] === 'undefined'
  ) {
    throw new Error(`The model '${modelID}' doesn't exist.`);
  }
  modelState = Object.keys(modelState).filter(n => n !== modelID).reduce(
    (obj, key) => ({ ...obj, [key]: modelState[key] }), {}
  );
  const modelType = modelIDMap[modelID];
  modelStateRoute = {
    ...modelStateRoute,
    [modelType]: modelStateRoute[modelType].filter(n => n !== modelID)
  };
  modelIDMap = Object.keys(modelIDMap).filter(n => n !== modelID).reduce(
    (obj, key) => ({ ...obj, [key]: modelIDMap[key] }), {}
  );
  updateListeners();
}

export function evaluateModelAction(
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
  return runRuntime(
    modelType, actionType, payload, { modelType, modelID }
  );
}

registerVariantsGenerator('state', (id: string) => modelState[id] || {});
registerVariantsGenerator('globalState', (id: string) => globalState);
registerVariantsGenerator('models', (id: string) => modelIDMap);
