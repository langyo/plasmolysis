/// <reference types="react" />
/// <reference types="vue" />

export type IPlatforms =
  'js.browser' | 'js.node' | 'js.electron' | 'js.cordova' | 'js.flutter';

export type IWebClientComponentType =
  (props: {
    state: { [key: string]: unknown },
    trigger: { [key: string]: (payload: { [key: string]: any }) => void }
  }) => string | React.Component | Vue.Component;

export interface IRuntimeObject {
  type: string,
  args: any[]
};

export type IRuntimeFunc = {
  [platform in IPlatforms]?: (
    payload: { [key: string]: any },
    variants: Readonly<{ [key: string]: any }>
  ) => Promise<{ [key: string]: any }>
};

export interface IContextManager {
  readonly getContexts: () => Readonly<{
    [key: string]: {
      [func: string]: (...args: any[]) => any
    }
  }>,
  readonly getConfig: (context: string) => Readonly<{ [key: string]: any }>,
  readonly setConfig: (context: string, value: { [key: string]: any }) => void
}

export interface IRuntimeManager {
  readonly loadRuntime: (
    runtime: IRuntimeObject, tag: string, name: string
  ) => void,
  readonly registerAction: (
    type: string,
    runtime: { [platform in IPlatforms]?: IRuntimeFunc } | IRuntimeFunc
  ) => void,
  readonly getRuntimeList: (tag: string) => string[],
  readonly hasRuntime: (tag: string, streamName: string) => boolean,
  readonly runRuntime: (
    tag: string,
    streamName: string,
    payload: { [key: string]: any },
    localContext: { [key: string]: any }
  ) => Promise<{ [key: string]: any }>
}

export interface IGlueManager {
  readonly getProtocol: (platform: IPlatforms) => (
    path: string, obj: { [key: string]: any }
  ) => Promise<{ [key: string]: any }>,
  readonly setProtocol: (
    platform: IPlatforms,
    func: (
      path: string, obj: { [key: string]: any }
    ) => Promise<{ [key: string]: any }>
  ) => void,
  readonly linkTo: (
    platform: IPlatforms,
    path: string,
    obj: { [key: string]: any }
  ) => Promise<{ [key: string]: any }>
}

export { contextManagerFactory } from './contextManager';
export { runtimeManagerFactory } from './runtimeManager';
export { glueManagerFactory } from './guleManager';

export { series } from './lib/series';
export { parallel } from './lib/parallel';
export { martix } from './lib/martix';
export { sideonly } from './lib/sideonly';
export { test } from './lib/test';
export { loop } from './lib/loop';
export { wait } from './lib/wait';
export { dispatch } from './lib/dispatch';
export { link } from './lib/link';
