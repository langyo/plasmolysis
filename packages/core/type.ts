export type Platforms = 'webClient' | 'nodeServer' | 'electronClient' | 'cordovaClient' | 'flutterClient';

export interface PackageInfo {
  name: string,
  description?: string,
  author?: string,
  repository?: string,

  // actions: {
  //   [platform in Platforms]: {
  //     [actionName: string]: ActionInfo
  //   }
  // }

  // bridges?: {
  //   [sourcePlatform in Platforms]: {
  //     [targetPlatform in Platforms]: {
  //       // When the framework compiles the action flow of the client, it will delete
  //       // all the information related to the server and convert the remaining part
  //       // into the part that can be directly recognized by the client action flow.
  //       [actionName: string]: ActionInfo
  //     }
  //   }
  // }
};

export interface ActionInfo<GeneratorObject extends object = {}> {
  translator: (...args: any[]) => ({ type: string, args: GeneratorObject })
  executor: (obj: GeneratorObject) =>
    (payload: object, globalContext: object, localContext: object) =>
      Promise<object>
};

export interface ActionObject<GeneratorObject extends object = {}> {
  disc: 'ActionObject',
  type: string,
  platform: Platforms,
  args: GeneratorObject
};

export interface ActionBridgeObject<SourceGeneratorObject extends object = {}> {
  disc: 'ActionBridgeObject',
  sourcePlatform: Platforms,
  sourceActionType: string,
  sourceAction: SourceGeneratorObject,
  targetPlatform: Platforms,
  targetStreamKey: string,
  targetStream: Array<ActionObject | ActionBridgeObject>
};

export interface PureActionObject<GeneratorObject extends object = {}> {
  type: string,
  args: GeneratorObject
};
