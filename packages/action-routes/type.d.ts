/// <reference path="../core/type.d.ts" />
/// <reference path="../action-preset/type.d.ts" />

interface RouteManager {
  readonly loadPage: (pageType: string, initState: { [key: string]: any }) => void,
  readonly getPageType: () => string,
  readonly setPageTitle: (title: string) => void,
  readonly getPageTitle: () => string
}

interface SessionManager {
  readonly joinSession: (id: string, initState?: { [key: string]: any }) => string,
  readonly verifySession: (id: string, checksum: string) => boolean,
  readonly getSessionState: (id: string) => Readonly<{ [key: string]: any }>,
  readonly setSessionState: (id: string, state: Readonly<{ [key: string]: any }>) => void,
  readonly getSessionList: () => { [id: string]: string },
  readonly getSessionAge: (id: string) => number,
  readonly leaveSession: (id: string) => void
}
