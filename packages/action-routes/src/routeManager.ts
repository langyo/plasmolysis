import {
  getModelIDList,
  createModel,
  destoryModel
} from 'nickelcat-action-preset/stateManager';

let title: string = '';

export function loadPage(pageType: string, initState: { [key: string]: any }): void {
  if (typeof getModelIDList()['$page'] !== 'undefined') {
    destoryModel('$page');
  }
  createModel(pageType, initState, '$page');
}

export function getPageType(): string {
  if (typeof getModelIDList()['$page'] === 'undefined') {
    return '';
  }
  else {
    return getModelIDList()['$page'];
  }
}

export function setPageTitle(currentTitle: string): void {
  title = currentTitle;
  document.title = title;
}

export function getPageTitle(): string {
  return title;
}
