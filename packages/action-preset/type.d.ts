declare interface PackageInfo {
  name: string,
  description?: string,
  author?: string,
  repository?: string,

  actions: Array<ActionInfo>
}

declare interface ActionInfo<GeneratorObject extends object = {}> {
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

declare interface ActionObject<GeneratorObject extends object = {}> {
  type: string,
  args: GeneratorObject
}

declare interface ActionBridgeObject {
  source: string,
  target: string,
  stream: Array<ActionObject | ActionBridgeObject>
}

// TODO Maybe the context generator should also move to the action package?

declare interface WebClientGlobalContext {
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

declare interface WebClientLocalContext {
  modelType: string,
  modelID: string
}

declare interface NodeServerGlobalContext {
  getSessionList: () => Promise<Array<string>>
}

declare interface NodeServerLocalContext {
  ip: string,
  sessionID: string
}
