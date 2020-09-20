export {
  IProjectPackage,
  IContextManager,
  IPlatforms,
  IWebClientComponentType,
  IRuntimeManager
} from '../core/type';
export {
  IStateManager,
  IModelManager
} from '../action-preset';
export {
  IRouteManager,
  ISessionManager
} from '../action-routes/type';

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
