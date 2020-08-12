/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/webClient/deal';

export function translator(
  { args }: OriginalActionObject<TranslatorRetObj>,
  getContext: GetContextFuncType
): Array<ActionNormalObject<TranslatorRetObj>> {
  return [{
    kind: 'ActionNormalObject',
    platform: 'webClient',
    pkg: 'preset',
    type: 'deal',
    args
  }];
}

export function executor({ func }: TranslatorRetObj) {
  return async (payload: { [key: string]: any }, globalContext: GetContextFuncType, localContext: WebClientLocalContext) => {
    return await func.call(null, payload, globalContext, localContext);
  };
}
