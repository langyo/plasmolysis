import {
  IPlatforms,
  IRuntime
} from '../../../core';
import {
  IGetters
} from '../../../action-preset';

export function togglePage(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any }
  }
): IRuntime;
export function togglePage(
  type: string,
  initState: { [key: string]: any }
): IRuntime;
export function togglePage(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any }
  }) | string,
  arg1?: { [key: string]: any }
): IRuntime {
  const generator = typeof arg0 === 'string' ? () => ({
    type: arg0,
    initState: arg1
  }) : arg0;
  return (platform: IPlatforms) => platform === 'js.browser' ? async (
    payload: { [key: string]: any }, {
      stateManager: {
        getState,
        getGlobalState,
        getModelList
      },
      routeManager: {
        getPageType,
        loadPage
      }
    }, {
      modelType, modelID
    }) => {
    const { type, initState } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });

    loadPage(type, initState);
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
    return payload;
  } : undefined;
};
