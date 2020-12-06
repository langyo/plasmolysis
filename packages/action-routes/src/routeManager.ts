import {
  getModelIDList,
  createModel,
  destoryModel
} from 'nickelcat-action-preset/stateManager';
import {
  bindComponent
} from 'nickelcat-action-preset/modelManager';
import { generate } from 'shortid';

let pageTitle: string = '';
let pageType: string = '';
let pageID: string = generate();

export function loadPage(
  pageType: string,
  initState: { [key: string]: any }
): void {
  if (typeof getModelIDList()[pageID] !== 'undefined') {
    destoryModel(pageID);
  }
  pageID = generate();
  createModel(
    pageType, initState, pageID,
    bindComponent(pageTitle, pageID, initState)
  );
}

export function getPageType(): string {
  if (typeof getModelIDList()[pageID] === 'undefined') {
    return '';
  }
  else {
    return getModelIDList()[pageID];
  }
}

export function setPageTitle(currentTitle: string): void {
  pageTitle = currentTitle;
  document.title = pageTitle;
}

export function getPageTitle(): string {
  return pageTitle;
}
