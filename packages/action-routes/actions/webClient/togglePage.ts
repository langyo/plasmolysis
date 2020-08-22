import {
  IGetContextFuncType,
  IActionNormalObject,
  IWebClientLocalContext,
  IStateManager,
  IRouteManager
} from '../../type';
import { ITranslatorRetObj } from '../../factorys/webClient/togglePage';

export function translator(
  args: ITranslatorRetObj,
  getContext: IGetContextFuncType
): IActionNormalObject<ITranslatorRetObj>[] {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset-router',
    type: 'togglePage',
    args
  }];
};

export function executor({ generator }: ITranslatorRetObj) {
  return async (
    payload: { [key: string]: any },
    getContext: IGetContextFuncType, {
      modelType,
      modelID
    }: IWebClientLocalContext) => {
    const {
      getState,
      getGlobalState,
      getModelList
    }: IStateManager = getContext('stateManager');
    const {
      loadPage,
      getPageType
    }: IRouteManager = getContext('routeManager');
    const { type, initState } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });

    loadPage(type, initState);
    window.history.pushState(initState, '', `${type}${
      initState && typeof initState === 'object' && Object.keys(initState).length > 0 ?
        `?${
        Object.keys(initState)
          .map(key => `${key}=${
            (
              typeof initState[key] === 'object'
              || Array.isArray(initState[key])
            ) && encodeURI(JSON.stringify(initState[key]))
            || initState[key]
            }`)
          .join('&')
        }` : ''
      }`);

    return payload;
  }
}
