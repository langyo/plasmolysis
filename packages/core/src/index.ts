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

export * as contextManager from './contextManager';
export * as runtimeManager from './runtimeManager';
export * as glueManager from './guleManager';

export { series } from './lib/series';
export { parallel } from './lib/parallel';
export { martix } from './lib/martix';
export { sideonly } from './lib/sideonly';
export { test } from './lib/test';
export { loop } from './lib/loop';
export { wait } from './lib/wait';
export { dispatch } from './lib/dispatch';
export { link } from './lib/link';
