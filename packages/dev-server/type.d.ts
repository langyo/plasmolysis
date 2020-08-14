/// <reference types="koa" />

declare module 'nickelcat-action-preset' {
  export const packageInfo: any;
}
declare module 'nickelcat-action-routes' {
  export const packageInfo: any;
}

declare type RequestForwardFuncType = (sessionInfo: {
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
}) => Promise<{
  processed: boolean,
  code: number,
  type: 'text/html' | 'application/json',
  body: string
}>;
