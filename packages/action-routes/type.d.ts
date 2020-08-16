/// <reference path="../core/type.d.ts" />
/// <reference path="../action-preset/type.d.ts" />

interface RouteManager {
  readonly loadPage: (pageType: string, initState: { [key: string]: any }) => void,
  readonly getPageType: () => string
}
