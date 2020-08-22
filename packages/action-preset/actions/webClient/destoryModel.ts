/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/webClient/destoryModel';

export function translator(
  { args }: OriginalActionObject<TranslatorRetObj>,
  getContext: GetContextFuncType
): ActionNormalObject<TranslatorRetObj>[] {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset',
    type: 'destoryModel',
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
      destoryModel
    }: StateManager = getContext('stateManager');
    const {
      getPageType
    }: RouteManager = getContext('routeManager');
    const { id } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    destoryModel(id);
    return payload;
  };
};
