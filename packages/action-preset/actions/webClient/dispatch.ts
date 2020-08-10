/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from "../../factorys/webClient/dispatch";

export function translator(
  args: TranslatorRetObj,
  getContext: GetContextFuncType
): Array<ActionNormalObject<TranslatorRetObj>> {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    type: 'dispatch',
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
      evaluateModelAction
    }: StateManager = getContext('stateManager');
    const { id, action, payload: retPayload } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      modelType,
      modelID
    });
    evaluateModelAction(id, action, retPayload);
    return payload;
  }
}