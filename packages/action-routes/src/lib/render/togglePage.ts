import { IGetters } from 'nickelcat-action-preset';
import { getModelList } from 'nickelcat-action-preset/modelManager';
import {
  getGlobalState,
  getState
} from 'nickelcat-action-preset/stateManager';
import {
  getPageType,
  togglePage as togglePageInside
} from '../../routeManager';

export function togglePage(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any }
  }
): void;
export function togglePage(
  type: string,
  initState: { [key: string]: any }
): void;
export function togglePage(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any }
  }) | string,
  arg1?: { [key: string]: any }
): void {
  const { type, initState } = typeof arg0 === 'string' ? {
    type: arg0, initState: arg1
  } : generator(payload, {
    state: getState(modelID),
    globalState: getGlobalState(),
    modelList: getModelList(),
    pageType: getPageType(),
    modelType,
    modelID
  });

  togglePageInside(type, initState);
  window.history.pushState(
    initState, '',
    `${type}${initState && typeof initState === 'object' && Object.keys(initState).length > 0 ?
      `?${Object.keys(initState)
        .map(key => `${key}=${(
          typeof initState[key] === 'object'
          || Array.isArray(initState[key])
        ) && encodeURI(JSON.stringify(initState[key]))
          || initState[key]
          }`)
        .join('&')
      }` : ''
    }`);
}

