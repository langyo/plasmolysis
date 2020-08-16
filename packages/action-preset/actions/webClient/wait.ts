/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/webClient/wait';

export function translator(
  { args }: OriginalActionObject<TranslatorRetObj>,
  getContext: GetContextFuncType
): Array<ActionNormalObject<TranslatorRetObj>> {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset',
    type: 'wait',
    args
  }];
}

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
      getPageType
    }: RouteManager = getContext('routeManager');
    const { length } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    return await (new Promise(resolve =>
      setTimeout(() => resolve(payload), length)
    ));
  };
};
