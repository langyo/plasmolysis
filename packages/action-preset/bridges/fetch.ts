import {
  ActionObject,
  ActionBridgeObject
} from '../../core/type';
import {
  WebClientGlobalContext,
  WebClientLocalContext
} from "../contexts/webClient/modelManager";

interface TranslatorRetObj {
  path: string,
  translator: PayloadTranslatorFunc,
  options: FetchOptions
};
interface FetchOptions {
  method?: 'GET' | 'POST',
  headers?: HeadersInit
};
type PayloadTranslatorFunc = (payload: object, utils: {
  modelType: string,
  modelID: string,
  getState: () => object,
  getGlobalState: () => object,
  getModelList: () => { [modelType: string]: Array<string> }
}) => object;

export function translator(
  path: string,
  translator: PayloadTranslatorFunc,
  stream: Array<ActionObject>,
  options?: FetchOptions
): ActionBridgeObject<TranslatorRetObj> {
  return {
    sourcePlatform: 'webClient',
    targetPlatform: 'nodeServer',
    sourceActionType: 'fetch',
    sourceAction: {
      path,
      translator,
      options: options || {}
    },
    targetStream: stream
  };
}

export function executor({ path, translator, options }: TranslatorRetObj) {
  return async (payload: object, {
    getState,
    getGlobalState,
    getModelList
  }: WebClientGlobalContext, {
    modelType,
    modelID
  }: WebClientLocalContext) => {
    const body = translator(payload, {
      getState: () => getState(modelID),
      getGlobalState,
      getModelList,
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
