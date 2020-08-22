/// <reference path="../../type.d.ts" />

export function routeManager(
  projectPackage: ProjectPackage,
  getContext: GetContextFuncType
): RouteManager {
  let title: string = '';

  function loadPage(pageType: string, initState: { [key: string]: any }): void {
    const {
      getModelIDList,
      createModel,
      destoryModel
    }: StateManager = getContext('stateManager');
    if (typeof getModelIDList()['$page'] !== 'undefined') {
      destoryModel('$page');
    }
    createModel(pageType, initState, '$page');
  }

  function getPageType(): string {
    const {
      getModelIDList
    }: StateManager = getContext('stateManager');
    if (typeof getModelIDList()['$page'] === 'undefined') {
      return '';
    }
    else {
      return getModelIDList()['$page'];
    }
  }

  function setPageTitle(currentTitle: string): void {
    title = currentTitle;
    document.title = title;
  }

  function getPageTitle(): string {
    return title;
  }

  return Object.freeze({
    loadPage,
    getPageType,
    setPageTitle,
    getPageTitle
  });
}