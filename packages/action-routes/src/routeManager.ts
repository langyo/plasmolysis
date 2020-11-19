import {
  getVariantsFromContext,
  setVariantsFromContext
} from 'nickelcat/entityManager';
import {
  getModelIDList,
  createModel,
  destoryModel
} from 'nickelcat-action-preset/stateManager';

// TODO - Use the runtime manager's entity storage.
let title: string = '';
let pageType: string = '';
let pageID: string = '';

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
