import {
  IOriginalActionObject,
  IGetContextFuncType,
  IActionNormalObject,
  IWebClientLocalContext,
  IStateManager,
  IRouteManager
} from '../../type';
import { ITranslatorRetObj } from '../../factorys/webClient/destoryModel';

export function translator(
  { args }: IOriginalActionObject<ITranslatorRetObj>,
  getContext: IGetContextFuncType
): IActionNormalObject<ITranslatorRetObj>[] {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset',
    type: 'destoryModel',
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
      destoryModel
    }: IStateManager = getContext('stateManager');
    const {
      getPageType
    }: IRouteManager = getContext('routeManager');
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
