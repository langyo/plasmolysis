/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/webClient/togglePage';

export function translator(
  args: TranslatorRetObj,
  getContext: GetContextFuncType
): Array<ActionNormalObject<TranslatorRetObj>> {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset-router',
    type: 'togglePage',
    args
  }];
};

export function executor({ generator }: TranslatorRetObj) {
  return async (payload: { [key: string]: any }, getContext: GetContextFuncType, {
    modelType,
    modelID
  }: WebClientLocalContext) => {
    const {
      getState,
      getGlobalState,
      getModelList
    }: StateManager = getContext('stateManager');
    const {
      loadPage,
      getPageType
    }: RouteManager = getContext('routeManager');
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
