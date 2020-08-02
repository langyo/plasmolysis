declare type Platforms = 'webClient' | 'nodeServer' | 'electronClient' | 'cordovaClient' | 'flutterClient'

declare interface PackageInfo {
  name: string,
  description?: string,
  author?: string,
  repository?: string,

  actions?: {
    [platform in Platforms]?: {
      [actionName: string]: ActionInfo
    }
  }

  bridges?: {
    [sourcePlatform in Platforms]?: {
      [targetPlatform in Platforms]?: {
        // When the framework compiles the action flow of the client, it will delete
        // all the information related to the server and convert the remaining part
        // into the part that can be directly recognized by the client action flow.
        [actionName: string]: ActionInfo
      }
    }
  }
}

declare type TranslatorFunc = (...args: any[]) => ActionObject
declare type ExecutorFunc = (obj: object) =>
  (payload: object, globalContext: object, localContext: object) =>
    Promise<object>

declare type ActionInfo = {
  translator: TranslatorFunc,
  executor: ExecutorFunc
}

declare type ActionObject =
  ActionNormalObject | ActionBridgeObject | ActionJudgeObject |
  ActionSubStream | ActionLoopTag

declare interface ActionNormalObject<T extends object = {}> {
  kind: 'ActionNormalObject',
  type: string,
  platform?: Platforms,
  args: T,
  catch?: Array<ActionObject>
}

declare interface ActionBridgeObject<T extends object = {}> {
  kind: 'ActionBridgeObject',
  sourcePlatform: Platforms,
  sourceActionType: string,
  sourceAction: T,
  sourceActionCatch?: Array<ActionObject>,
  targetPlatform: Platforms,
  targetStreamKey: string,
  targetStream: Array<ActionObject>
}

declare interface ActionJudgeObject {
  kind: 'ActionJudgeObject',
  cond: (payload: object, globalContext: object, localContext: object) => boolean
}

declare interface ActionSubStream {
  kind: 'ActionSubStream',
  stream: Array<ActionObject>
}

declare interface ActionLoopTag {
  kind: 'ActionLoopTag',
  mode: 'fixed' | 'unlimited',
  wait?: number
}
