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

export { dirWatcher } from './dirWatcher';
export { scan as dirScanner } from './dirScanner';
export { vfsLoader } from './virtualFileSystemLoader';
export { vmLoader } from './virtualMachineLoader';
export { webpackCompiler as webpackCompilerFactory } from './webpackLoader';
