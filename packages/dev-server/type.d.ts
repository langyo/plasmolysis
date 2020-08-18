/// <reference types="node" />
/// <reference path="../action-preset/type.d.ts" />
/// <reference path="../core/type.d.ts" />

declare module 'nickelcat-action-preset' {
  export const packageInfo: any;
}
declare module 'nickelcat-action-routes' {
  export const packageInfo: any;
}
declare module 'nickelcat' {
  export const actionManager: (projectPackage: ProjectPackage) => ActionManager;
  export const streamManager: (
    projectPackage: ProjectPackage,
    getContext: GetContextFuncType
  ) => StreamManager;
  export const streamGenerator: (
    platform: Platforms,
    stream: Array<OriginalActionObject>,
    actionManager: ActionManager
  ) => Array<ActionObject>;
  export const streamRuntime: (
    platform: Platforms,
    globalContext: GetContextFuncType
  ) => (
      tasks: Array<ActionObject>,
      path: string,
      localContext: { [key: string]: any }
    ) => (
        payload: { [key: string]: any }
      ) => Promise<{ [key: string]: any }>;
}

declare interface SessionInfo {
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

declare type RequestForwardFuncType = (sessionInfo: SessionInfo) => Promise<RequestForwardObjectType>;

declare type RequestForwardObjectType = {
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
