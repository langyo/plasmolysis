/// <reference path="../../type.d.ts" />

import { TranslatorRetObj } from '../../factorys/webClient/fetch';

export function translator(
  { args:
    { path, stream, translator, options }
  }: OriginalActionObject<TranslatorRetObj>,
  getContext: GetContextFuncType
): ActionNormalObject<TranslatorRetObj>[] {
  if (typeof stream !== 'undefined') {
    (getContext('streamManager') as StreamManager).loadStream(stream, 'nodeServer', 'http', path);
  }
  if (typeof translator !== undefined) {
    return [{
      kind: 'ActionNormalObject',
      platform: 'webClient',
      pkg: 'preset',
      type: 'fetch',
      args: {
        path,
        translator,
        options: options || {}
      }
    }];
  }
  else {
    return [];
  }
};

export function executor({ path, translator, options }: TranslatorRetObj) {
  return async (
    payload: { [key: string]: any },
    getContext: GetContextFuncType, {
      modelType,
      modelID
    }: WebClientLocalContext) => {
    const {
      getState,
      getGlobalState,
      getModelList
    }: StateManager = getContext('stateManager');
    const {
      getPageType
    }: RouteManager = getContext('routeManager');
    const body = translator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
      getPageType,
      modelType,
      modelID
    });
    return (await fetch(path, {
      method: options.method || 'POST',
      headers: options.headers || {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      credentials: 'same-origin'
    })).json();
  }
}
