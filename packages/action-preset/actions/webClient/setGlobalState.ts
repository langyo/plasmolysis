/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from "../../factorys/webClient/setGlobalState";

export function translator(
  args: TranslatorRetObj,
  getContext: GetContextFuncType
): Array<ActionNormalObject<TranslatorRetObj>> {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
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
    const ret = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      modelType,
      modelID
    });
    setGlobalState(ret);
    return payload;
  }
}
