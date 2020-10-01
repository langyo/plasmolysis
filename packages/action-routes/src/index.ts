export interface IRouteManager {
  readonly loadPage: (
    pageType: string, initState: { [key: string]: any }
  ) => void,
  readonly getPageType: () => string,
  readonly setPageTitle: (title: string) => void,
  readonly getPageTitle: () => string
}

export interface ISessionManager {
  readonly joinSession: (
    id: string, initState?: { [key: string]: any }
  ) => string,
  readonly verifySession: (id: string, checksum: string) => boolean,
  readonly getSessionState: (id: string) => Readonly<{ [key: string]: any }>,
  readonly setSessionState: (
    id: string, state: Readonly<{ [key: string]: any }>
  ) => void,
  readonly getSessionList: () => { [id: string]: string },
  readonly getSessionAge: (id: string) => number,
  readonly leaveSession: (id: string) => void
}

export { togglePage } from './lib/togglePage';
