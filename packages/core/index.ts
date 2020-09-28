/// <reference types="react" />
/// <reference types="vue" />

export type IPlatforms = 'webClient' | 'nodeServer' | 'electronClient' | 'cordovaClient' | 'flutterClient'

export interface IPackageInfo {
  name: string,

  contexts?: {
    [platform in IPlatforms]?: {
      [key: string]: (
        projectPackage: IProjectPackage,
        contexts: Readonly<{ [key: string]: (...args: any[]) => any }>
      ) => any
    }
  }
}

export type IWebClientComponentType =
  (props: {
    state: { [key: string]: unknown },
    trigger: { [key: string]: (payload: { [key: string]: any }) => void }
  }) => string | React.Component | Vue.Component;

export type IProjectPackage = {
  data?: {
    webClient?: {
      [modelType: string]: {
        component: IWebClientComponentType,
        controller: {
          init?: (
            payload: { [key: string]: any },
            globalContext: Readonly<{ [key: string]: (...args: any[]) => any }>,
            localContext: { [key: string]: any }
          ) => { [key: string]: any },
          preload?: (
            payload: { [key: string]: any },
            globalContext: Readonly<{ [key: string]: (...args: any[]) => any }>,
            localContext: { [key: string]: any }
          ) => { [key: string]: any },
          [actionName: string]: { type: string, args: any }[] | any
        }
      }
    },
    nodeServer?: {
      [protocol: string]: {
        [path: string]: { type: string, args: any }[]
      }
    }
  },
  config?: {
    [key in IPlatforms]?: {
      [key: string]: any
    }
  }
};

export type IRuntime = (
  platform: IPlatforms,
  publicContexts: {
    contextManager: IContextManager,
    runtimeManager: IRuntimeManager
  }
) => (
    payload: { [key: string]: any },
    contexts: Readonly<{
      [key: string]: { [func: string]: (...args: any[]) => any }
    }>,
    variants: Readonly<{ [key: string]: any }>
  ) => Promise<{ [key: string]: any }>;

export interface IContextManager {
  readonly getContexts: () => Readonly<{
    [key: string]: {
      [func: string]: (...args: any[]) => any
    }
  }>,
  readonly getConfig: (context: string) => Readonly<{ [key: string]: any }>,
  readonly setConfig: (context: string, value: { [key: string]: any }) => void,
  readonly loadProjectPackage: (projectPackage: IProjectPackage) => void,
  readonly loadActionPackage: (packageInfo: IPackageInfo) => void
}

export interface IRuntimeManager {
  readonly loadRuntime: (
    runtime: IRuntime,
    platform: IPlatforms,
    tag: string,
    name: string
  ) => void,
  readonly loadPackage: (projectPackage: IProjectPackage) => void,
  readonly getRuntimeList: (platform: IPlatforms, tag: string) => string[],
  readonly hasRuntime: (
    platform: IPlatforms, tag: string, streamName: string
  ) => boolean,
  readonly runRuntime: (
    platform: IPlatforms,
    tag: string,
    streamName: string,
    payload: { [key: string]: any },
    localContext: { [key: string]: any }
  ) => { [key: string]: any }
}

export { contextManager } from './contextManager';
export { runtimeManager } from './runtimeManager';

export { series } from './series';
export { parallel } from './parallel';
export { martix } from './martix';
