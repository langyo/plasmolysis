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

export type TranslatorFunc<T extends object = {}> = (...args: any[]) => ActionObject<T> | ActionBridgeObject<T>;
export type ExecutorFunc<T extends object = {}> = (obj: T) =>
  (payload: object, globalContext: object, localContext: object) =>
    Promise<object>;

export type ActionInfo<T extends object = {}> = {
  translator: TranslatorFunc<T>,
  executor: ExecutorFunc<T>
};

export interface ActionObject<T extends object = {}> {
  disc: 'ActionObject',
  type: string,
  platform: Platforms,
  args: T
};

export interface ActionBridgeObject<T extends object = {}> {
  disc: 'ActionBridgeObject',
  sourcePlatform: Platforms,
  sourceActionType: string,
  sourceAction: T,
  targetPlatform: Platforms,
  targetStreamKey: string,
  targetStream: Array<ActionObject | ActionBridgeObject>
};

export interface PureActionObject<GeneratorObject extends object = {}> {
  type: string,
  args: GeneratorObject
};
