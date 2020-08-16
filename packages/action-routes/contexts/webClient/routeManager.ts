/// <reference path="../../type.d.ts" />

export default (projectPackage: ProjectPackage, getContext: GetContextFuncType): RouteManager => {
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
    if (typeof getModelIDList()['$page'] === 'undefined') return '';
    else return getModelIDList()['$page'];
  }

  return Object.freeze({
    loadPage,
    getPageType
  });
}