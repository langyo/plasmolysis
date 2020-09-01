/// <reference types="react" />
/// <reference types="vue" />

export type IPlatforms = 'webClient' | 'nodeServer' | 'electronClient' | 'cordovaClient' | 'flutterClient'

export interface IPackageInfo {
  name: string,
  description?: string,
  author?: string,
  repository?: string,

  actions?: {
    [platform in IPlatforms]?: {
      [actionName: string]: IActionInfo
    }
  }

  contexts?: {
    [platform in IPlatforms]?: {
      [key: string]: (
        projectPackage: IProjectPackage, getContext: IGetContextFuncType
      ) => any
    }
  }
}

export type ITranslatorFunc = (...args: any[]) => IActionObject[];
export type IExecutorFunc = (obj: { [key: string]: any }) => (
  payload: { [key: string]: any },
  globalContext: { [key: string]: any },
  localContext: { [key: string]: any }
) => Promise<{ [key: string]: any }>;

export type IActionInfo = {
  translator: ITranslatorFunc,
  executor: IExecutorFunc
}

export type IOriginalActionObject<T = any> = {
  platform: IPlatforms,
  pkg: string,
  type: string,
  args: T
  catch?: IOriginalActionObject[]
};

export type IActionObject =
  IActionNormalObject | IActionJudgeObject |
  IActionSubStream | IActionLoopTag

export interface IActionNormalObject<T extends { [key: string]: any } = {}> {
  kind: 'ActionNormalObject',
  pkg: string,
  type: string,
  platform?: IPlatforms,
  args: T,
  catch?: IActionObject[]
}

export interface IActionJudgeObject {
  kind: 'ActionJudgeObject',
  cond: (
    payload: { [key: string]: any },
    globalContext: { [key: string]: any },
    localContext: { [key: string]: any }
  ) => boolean
}

export interface IActionSubStream {
  kind: 'ActionSubStream',
  stream: IActionObject[]
}

export interface IActionLoopTag {
  kind: 'ActionLoopTag',
  mode: 'fixed' | 'unlimited',
  wait?: number
}

export type IWebClientComponentType =
  (props: {
    state: { [key: string]: unknown },
    trigger: { [key: string]: (payload: { [key: string]: any }) => void }
  }) => string | React.Component | Vue.Component;

export type IProjectPackage = {
  data: {
    webClient?: {
      [modelType: string]: {
        component: IWebClientComponentType,
        controller: {
          $init?: (
            payload: { [key: string]: any },
            globalContext: IGetContextFuncType,
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
  config: {
    webClient?: {
      [key: string]: any
    },
    nodeServer?: {
      [key: string]: any
    }
  }
};

export type IGetContextFuncType =
  (type: 'actionManager' | 'streamManager' | string) => any;

export interface IActionManager {
  readonly getContextFactory: (platform: IPlatforms) => IGetContextFuncType,
  readonly getTranslator: (
    platform: IPlatforms,
    packageName: string,
    actionName: string
  ) => ITranslatorFunc,
  readonly getExecutor: (
    platform: IPlatforms,
    packageName: string,
    actionName: string
  ) => IExecutorFunc,
  readonly loadPackage: (packageInfo: IPackageInfo) => void
}

export interface IStreamManager {
  readonly loadStream: (
    stream: IOriginalActionObject[],
    platform: IPlatforms,
    tag: string,
    streamName: string
  ) => void,
  readonly getStreamList: (platform: IPlatforms, tag: string) => string[],
  readonly testStreamExist: (
    platform: IPlatforms, tag: string, key: string
  ) => boolean,
  readonly runStream: (
    platform: IPlatforms,
    tag: string,
    streamName: string,
    payload: { [key: string]: any },
    localContext: { [key: string]: any }
  ) => { [key: string]: any }
}
