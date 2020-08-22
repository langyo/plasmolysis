import {
  IOriginalActionObject,
  IGetContextFuncType,
  IActionNormalObject,
  IWebClientLocalContext,
  IStateManager,
  IRouteManager
} from '../../type';
import { ITranslatorRetObj } from "../../factorys/webClient/dispatch";

export function translator(
  { args }: IOriginalActionObject<ITranslatorRetObj>,
  getContext: IGetContextFuncType
): IActionNormalObject<ITranslatorRetObj>[] {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset',
    type: 'dispatch',
    args
  }];
};

export function executor({ generator }: ITranslatorRetObj) {
  return async (
    payload: { [key: string]: any },
    getContext: IGetContextFuncType, {
      modelType,
      modelID
    }: IWebClientLocalContext) => {
    const {
      getState,
      getGlobalState,
      getModelList,
      evaluateModelAction
    }: IStateManager = getContext('stateManager');
    const {
      getPageType
    }: IRouteManager = getContext('routeManager');
    const { id, action, payload: retPayload } = generator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    evaluateModelAction(id, action, retPayload);
    return payload;
  }
}