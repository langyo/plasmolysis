import {
  IOriginalActionObject,
  IGetContextFuncType,
  IActionNormalObject,
  IWebClientLocalContext,
  IStateManager,
  IRouteManager
} from '../../type';
import { ITranslatorRetObj } from "../../factorys/webClient/setGlobalState";

export function translator(
  { args }: IOriginalActionObject<ITranslatorRetObj>,
  getContext: IGetContextFuncType
): IActionNormalObject<ITranslatorRetObj>[] {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset',
    type: 'setGlobalState',
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
      setGlobalState
    }: IStateManager = getContext('stateManager');
    const {
      getPageType
    }: IRouteManager = getContext('routeManager');
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
