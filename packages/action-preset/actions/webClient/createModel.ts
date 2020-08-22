/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/webClient/createModel';

export function translator(
  { args }: OriginalActionObject<TranslatorRetObj>,
  getContext: GetContextFuncType
): ActionNormalObject<TranslatorRetObj>[] {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset',
    type: 'createModel',
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
      createModel
    }: StateManager = getContext('stateManager');
    const {
      getPageType
    }: RouteManager = getContext('routeManager');
    const { type, initState, name } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    createModel(type, initState, name);
    return payload;
  };
};
