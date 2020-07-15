export interface PackageInfo {
  name: string,
  description?: string,
  author?: string,
  repository?: string,

  actions: Array<ActionInfo>
}

export interface ActionInfo<GeneratorObject extends object = {}> {
  translator: {
    [key: string]: (...args: any[]) => ({ type: string, args: GeneratorObject })
  },
  executor: {
    [key: string]:
      (obj: GeneratorObject) =>
      (payload: object, globalContext: object, localContext: object) =>
      Promise<object>
  }
}

export interface ActionObject<GeneratorObject extends object = {}> {
  type: string,
  args: GeneratorObject
}

export interface ActionBridgeObject<SourceGeneratorObject extends object = {}> {
  sourcePlatform: string,
  sourceActionType: string,
  sourceAction: SourceGeneratorObject,
  targetPlatform: string,
  targetStream: Array<ActionObject | ActionBridgeObject>
}

// TODO Maybe the context generator should also move to the action package?

export interface WebClientGlobalContext {
  setState: (modelID: string, combineState: object) => void,
  getState: (modelID: string) => object,
  setGlobalState: (combineState: object) => void,
  getGlobalState: () => ({
    $pageType?: string,
    $pageID?: string,
    [key: string]: unknown
  }),
  getModelList: () => ({ [modelType: string]: Array<string> }),
  createModel: (modelType: string, initState?: object, modelID?: string) => void,
  destoryModel: (modelID: string) => void,
  evaluateModelAction: (modelID: string, actionType: string, payload: object) => object
}

export interface WebClientLocalContext {
  modelType: string,
  modelID: string
}

export interface NodeServerGlobalContext {
  getSessionList: () => Promise<Array<string>>
}

export interface NodeServerLocalContext {
  ip: string,
  sessionID: string
}
