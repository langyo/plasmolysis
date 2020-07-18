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

import {
  WebClientGlobalContext,
  WebClientLocalContext
} from'./contexts/webClient/modelManager';
import {
  NodeServerGlobalContext,
  NodeServerLocalContext
} from './contexts/nodeServer/modelManager';

export {
  WebClientGlobalContext,
  WebClientLocalContext,
  NodeServerGlobalContext,
  NodeServerLocalContext
};