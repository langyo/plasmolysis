export interface IGlobalState {
  [key: string]: unknown
};

let globalState: { [key: string]: any } = {};
let modelState: { [key: string]: any } = {};
let modelIDMap: { [modelID: string]: string } = {};

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
  modelID: string
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
  return modelID;
}

export function destoryModel(modelID: string): void {
  if (
    typeof modelState[modelID] === 'undefined' ||
    typeof modelIDMap[modelID] === 'undefined'
  ) {
    throw new Error(`The data of the model '${modelID}' is broken.`);
  }
  delete modelState[modelID];
  delete modelIDMap[modelID];
}
