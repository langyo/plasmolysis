/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from "../../factorys/webClient/setGlobalState";

export function translator(
  { args }: OriginalActionObject<TranslatorRetObj>,
  getContext: GetContextFuncType
): Array<ActionNormalObject<TranslatorRetObj>> {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset',
    type: 'setGlobalState',
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
      getModelList,
      setGlobalState
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
    setGlobalState(ret);
    return payload;
  }
}
