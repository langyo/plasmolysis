/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/webClient/destoryModel';

export function translator(
  args: TranslatorRetObj,
  getContext: GetContextFuncType
): Array<ActionNormalObject<TranslatorRetObj>> {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    type: 'destoryModel',
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
      destoryModel
    }: StateManager = getContext('stateManager');
    const { id } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      modelType,
      modelID
    });
    destoryModel(id);
    return payload;
  };
};
