import {
  IOriginalActionObject,
  IGetContextFuncType,
  IActionNormalObject,
  IWebClientLocalContext,
  IStreamManager,
  IStateManager,
  IRouteManager
} from '../../type';
import { ITranslatorRetObj } from '../../factorys/webClient/fetch';

export function translator(
  { args:
    { path, stream, translator, options }
  }: IOriginalActionObject<ITranslatorRetObj>,
  getContext: IGetContextFuncType
): IActionNormalObject<ITranslatorRetObj>[] {
  if (typeof stream !== 'undefined') {
    (getContext('streamManager') as IStreamManager).loadStream(stream, 'nodeServer', 'http', path);
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

export function executor({ path, translator, options }: ITranslatorRetObj) {
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
    const {
      getPageType
    }: IRouteManager = getContext('routeManager');
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
