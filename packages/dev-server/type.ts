/// <reference types="node" />
/// <reference path="./type.d.ts" />

export {
  IProjectPackage,
  IActionManager,
  IPlatforms,
  IGetContextFuncType,
  IWebClientComponentType,
  IActionObject,
  IOriginalActionObject,
  IStreamManager
} from '../core/type';
export {
  IStateManager,
  IModelManager,
  IRouteManager
} from '../action-preset/type';
export {
  ISessionManager
} from '../action-routes/type';

// declare module 'nickelcat' {
//   export const actionManager: (
//     projectPackage: IProjectPackage
//   ) => IActionManager;
//   export const streamManager: (
//     projectPackage: IProjectPackage,
//     getContext: IGetContextFuncType
//   ) => IStreamManager;
//   export const streamGenerator: (
//     platform: IPlatforms,
//     stream: IOriginalActionObject[],
//     actionManager: IActionManager
//   ) => IActionObject[];
//   export const streamRuntime: (
//     platform: IPlatforms,
//     globalContext: IGetContextFuncType
//   ) => (
//       tasks: IActionObject[],
//       path: string,
//       localContext: { [key: string]: any }
//     ) => (
//         payload: { [key: string]: any }
//       ) => Promise<{ [key: string]: any }>;
// }

export interface ISessionInfo {
  ip: string,
  protocol: string,
  host: string,
  path: string,
  query: { [key: string]: string },
  cookies: {
    readonly get: (key: string) => string,
    readonly set: (key: string, value: string, options?: {
      maxAge?: number,
      expires?: Date,
      path?: string,
      domain?: string,
      secure?: boolean,
      httpOnly?: boolean,
      sameSite?: boolean,
      signed?: boolean
    }) => void
  }
}

export type IRequestForwardFuncType =
  (sessionInfo: ISessionInfo) => Promise<IRequestForwardObjectType>;

export type IRequestForwardObjectType = {
  status: 'processed',
  code: number,
  type: 'text/html' | 'application/json',
  body: string
} | {
  status: 'ignored',
  code: null,
  type: null,
  body: null
};
