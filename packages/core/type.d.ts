/// <reference types="react" />
/// <reference types="vue" />

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

  contexts?: {
    [platform in Platforms]: {
      [key: string]: (projectPackage: ProjectPackage, getContext: GetContextFuncType) =>
        ({ [name: string]: (...args: any[]) => any })
    }
  }
}

declare type TranslatorFunc = (...args: any[]) => ActionObject
declare type ExecutorFunc = (obj: { [key: string]: any }) =>
  (payload: { [key: string]: any }, globalContext: { [key: string]: any }, localContext: { [key: string]: any }) =>
    Promise<{ [key: string]: any }>

declare type ActionInfo = {
  translator: TranslatorFunc,
  executor: ExecutorFunc
}

declare type ActionObject =
  ActionNormalObject | ActionJudgeObject |
  ActionSubStream | ActionLoopTag

declare interface ActionNormalObject<T extends { [key: string]: any } = {}> {
  kind: 'ActionNormalObject',
  type: string,
  platform?: Platforms,
  args: T,
  catch?: Array<ActionObject>
}

declare interface ActionJudgeObject {
  kind: 'ActionJudgeObject',
  cond: (payload: { [key: string]: any }, globalContext: { [key: string]: any }, localContext: { [key: string]: any }) => boolean
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

declare type WebClientComponentType =
  (props: WebClientComponentPropsType) => string | React.Component | Vue.Component;

declare interface WebClientComponentPropsType {
  state: { [key: string]: unknown },
  trigger: { [key: string]: (payload: { [key: string]: any }) => void }
}

declare type ProjectPackage = {
  webClient?: {
    [modelType: string]: {
      component: WebClientComponentType,
      controller: {
        $init?: (payload: { [key: string]: any }, globalContext: GetContextFuncType, localContext: { [key: string]: any }) => { [key: string]: any }
      }
    }
  }
};

declare type GetContextFuncType =
  (type: 'actionManager' | 'streamManager' | string) => any;

declare interface ActionManager {
  readonly getContext: (platform: Platforms) => GetContextFuncType,
  readonly getTranslator: (platform: Platforms, name: string) => TranslatorFunc,
  readonly getExecutor: (platform: Platforms, name: string) => ExecutorFunc,
  readonly loadPackage: (packageInfo: PackageInfo) => void
}

declare interface StreamManager {
  readonly loadStream: (
    stream: Array<ActionObject>,
    platform: Platforms,
    tag: string,
    streamName: string
  ) => void,
  readonly runStream: (
    platform: Platforms,
    tag: string,
    streamName: string,
    payload: { [key: string]: any },
    localContext: { [key: string]: any }
  ) => { [key: string]: any }
}

declare module 'nickelcat-action-preset/package';
declare module 'nickelcat-action-routes/package';
