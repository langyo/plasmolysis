import {
  IOriginalActionObject,
  IGetContextFuncType,
  IActionNormalObject,
  IWebClientLocalContext
} from '../../type';

import { ITranslatorRetObj } from '../../factorys/nodeServer/deal';

export function translator(
  { args }: IOriginalActionObject<ITranslatorRetObj>,
  getContext: IGetContextFuncType
): IActionNormalObject<ITranslatorRetObj>[] {
  return [{
    kind: 'ActionNormalObject',
    platform: 'nodeServer',
    pkg: 'preset',
    type: 'deal',
    args
  }];
}

export function executor({ func }: ITranslatorRetObj) {
  return async (
    payload: { [key: string]: any },
    globalContext: IGetContextFuncType,
    localContext: IWebClientLocalContext
  ) => {
    return await func.call(undefined, payload, globalContext, localContext);
  };
}
