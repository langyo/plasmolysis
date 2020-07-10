export interface PackageInfo {
  name: string,
  description?: string,
  author?: string,
  repository?: string,

  actions: Array<ActionInfo>
};

export interface ActionInfo {
  translator: {
    // [key: string]: (...args: any[]) => ActionObject | ActionBridgeObject
    [key: string]: unknown
  },
  executor: {
    // [key: string]:
      // (obj: ActionObject | ActionBridgeObject) =>
      // (payload: object, globalContext: object, localContext: object) =>
      // Promise<object>
    [key: string]: unknown
  }
};

export interface ActionObject {
  type: string,
  args: { [key: string]: any }
};

export interface ActionBridgeObject {
  source: string,
  target: string,
  stream: Array<ActionObject | ActionBridgeObject>
};

// TODO Maybe the context generator should also move to the action package?

export interface WebClientGlobalContext {
  setState: (modelID: string, combineState: object) => void,
  getState: (modelID: string) => object,
  setGlobalState: (combineState: object) => void,
  getGlobalState: () => object,
  getModelList: () => ({ [modelType: string]: Array<string> }),
  createModel: (modelType: string, initState?: object, modelID?: string) => void,
  destoryModel: (modelID: string) => void,
  evaluateModelAction: (modelID: string, actionType: string, payload: object) => object
};

export interface WebClientLocalContext {
  modelType: string,
  modelID: string
};

export type WebClientActionGeneratorFunc<T = object> = (payload: object, utils: {
  modelType: string,
  modelID: string,
  getState: () => object,
  getGlobalState: () => object,
  getModelList: () => { [modelType: string]: Array<string> }
}) => T;
