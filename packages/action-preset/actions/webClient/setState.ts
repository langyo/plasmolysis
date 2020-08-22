/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/webClient/setState';

export function translator(
  { args }: OriginalActionObject<TranslatorRetObj>,
  getContext: GetContextFuncType
): ActionNormalObject<TranslatorRetObj>[] {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset',
    type: 'setState',
    args
  }];
};

export function executor({ generator }: TranslatorRetObj) {
  return async (
    payload: { [key: string]: any },
    getContext: GetContextFuncType, {
      modelType,
      modelID
    }: WebClientLocalContext) => {
    const {
      getState,
      getGlobalState,
      getModelList,
      setState
    }: StateManager = getContext('stateManager');
    const {
      getPageType
    }: RouteManager = getContext('routeManager');
    const ret = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    setState(modelID, ret);
    return payload;
  }
}
