import {
  IOriginalActionObject,
  IGetContextFuncType,
  IActionNormalObject,
  IWebClientLocalContext,
  IStateManager
} from '../../type';
import { ITranslatorRetObj } from '../../factorys/nodeServer/wait';

export function translator(
  { args }: IOriginalActionObject<ITranslatorRetObj>,
  getContext: IGetContextFuncType
): IActionNormalObject<ITranslatorRetObj>[] {
  return [{
    kind: 'ActionNormalObject',
    platform: 'nodeServer',
    pkg: 'preset',
    type: 'wait',
    args
  }];
}

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
      getModelList
    }: IStateManager = getContext('stateManager');
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
