export type Platforms = 'webClient' | 'nodeServer' | 'electronClient' | 'cordovaClient' | 'flutterClient';

export interface PackageInfo {
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
};

export type TranslatorFunc = (...args: any[]) => ActionObject;
export type ExecutorFunc = (obj: object) =>
  (payload: object, globalContext: object, localContext: object) =>
    Promise<object>;

export type ActionInfo = {
  translator: TranslatorFunc,
  executor: ExecutorFunc
};

export type ActionObject =
  ActionNormalObject | ActionBridgeObject | ActionJudgeObject |
  ActionSubStream | ActionLoopTag;

export interface ActionNormalObject<T extends object = {}> {
  kind: 'ActionNormalObject',
  type: string,
  platform?: Platforms,
  args: T,
  catch?: Array<ActionObject>
};

export interface ActionBridgeObject<T extends object = {}> {
  kind: 'ActionBridgeObject',
  sourcePlatform: Platforms,
  sourceActionType: string,
  sourceAction: T,
  sourceActionCatch?: Array<ActionObject>,
  targetPlatform: Platforms,
  targetStreamKey: string,
  targetStream: Array<ActionObject>
};

export interface ActionJudgeObject {
  kind: 'ActionJudgeObject',
  cond: (payload: object, globalContext: object, localContext: object) => boolean
};

export interface ActionSubStream {
  kind: 'ActionSubStream',
  stream: Array<ActionObject>
};

export interface ActionLoopTag {
  kind: 'ActionLoopTag',
  mode: 'fixed' | 'unlimited',
  wait?: number
};
