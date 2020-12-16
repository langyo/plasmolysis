import {
  runRuntime,
  registerVariantsGenerator
} from 'nickelcat/runtimeManager';

export interface IGlobalState {
  [key: string]: unknown
};

let globalState: { [key: string]: any } = {};
let modelState: { [key: string]: any } = {};
let modelIDMap: { [modelID: string]: string } = {};
let listeners: { [id: string]: () => void } = {};

export function getState(modelID: string): Readonly<{ [key: string]: any }> {
  if (typeof modelState[modelID] === 'undefined') {
    throw new Error(`The model '${modelID}' doesn't exist.`);
  }
  return { ...modelState[modelID] };
}

export function getGlobalState(): IGlobalState {
  return { ...globalState };
}

export function getModelIDList(): { [modelID: string]: string } {
  return { ...modelIDMap };
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
  modelState = { ...modelState, [modelID]: combineState };
}

export function setGlobalState(combineState: { [key: string]: any }): void {
  globalState = { ...globalState, ...combineState };
}

export function createModel(
  modelType: string,
  initState: { [key: string]: any },
  modelID: string,
  updateListener: () => void
): string {
  if (
    typeof modelState[modelID] !== 'undefined' ||
    typeof modelIDMap[modelID] !== 'undefined'
  ) {
    throw new Error(`The model '${modelID}' has been declared.`);
  }

  modelState = {
    ...modelState,
    [modelID]: initState
  };
  modelIDMap = { ...modelIDMap, [modelID]: modelType };
  listeners[modelID] = updateListener;
  return modelID;
}

export function destoryModel(modelID: string): void {
  if (
    typeof modelState[modelID] === 'undefined' ||
    typeof modelIDMap[modelID] === 'undefined' ||
    typeof listeners[modelID] === 'undefined'
  ) {
    throw new Error(`The data of the model '${modelID}' is broken.`);
  }
  delete modelState[modelID];
  delete modelIDMap[modelID];
  delete listeners[modelID];
}

registerVariantsGenerator('state', (id: string) => modelState[id] || {});
registerVariantsGenerator('globalState', (_id: string) => globalState);
registerVariantsGenerator('models', (_id: string) => modelIDMap);
