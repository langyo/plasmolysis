/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/nodeServer/wait';

export function translator(
  { args }: OriginalActionObject<TranslatorRetObj>,
  getContext: GetContextFuncType
): Array<ActionNormalObject<TranslatorRetObj>> {
  return [{
    kind: 'ActionNormalObject',
    platform: 'nodeServer',
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
    const { length } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      modelType,
      modelID
    });
    return await (new Promise(resolve =>
      setTimeout(() => resolve(payload), length)
    ));
  };
};
