let globalState: { [key: string]: any } = {};
let modelState: { [key: string]: any } = {};
let modelIDMap: { [modelID: string]: string } = {};

export function getState(modelID: string): Readonly<{ [key: string]: any }> {
  if (typeof modelState[modelID] === 'undefined') {
    throw new Error(`The model '${modelID}' doesn't exist.`);
  }
  return { ...modelState[modelID] };
}

export function getGlobalState(): { [key: string]: unknown } {
  return { ...globalState };
}

export function getModelIDList(): { [modelID: string]: string } {
  return { ...modelIDMap };
}

export function setState(
  modelID: string,
  combineState: { [key: string]: any }
): void {
  modelState = { ...modelState, [modelID]: combineState };
}

export function setGlobalState(combineState: { [key: string]: any }): void {
  globalState = { ...globalState, ...combineState };
}
