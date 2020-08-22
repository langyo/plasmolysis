import {
  IProjectPackage,
  IGetContextFuncType,
  IStateManager,
  IRouteManager
} from '../../type';

export function routeManager(
  projectPackage: IProjectPackage,
  getContext: IGetContextFuncType
): IRouteManager {
  let title: string = '';

  function loadPage(pageType: string, initState: { [key: string]: any }): void {
    const {
      getModelIDList,
      createModel,
      destoryModel
    }: IStateManager = getContext('stateManager');
    if (typeof getModelIDList()['$page'] !== 'undefined') {
      destoryModel('$page');
    }
    createModel(pageType, initState, '$page');
  }

  function getPageType(): string {
    const {
      getModelIDList
    }: IStateManager = getContext('stateManager');
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