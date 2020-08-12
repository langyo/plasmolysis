export interface TranslatorRetObj {
  path: string,
  translator?: PayloadTranslatorFunc,
  stream?: Array<ActionObject>,
  options?: FetchOptions
};
interface FetchOptions {
  method?: 'GET' | 'POST',
  headers?: HeadersInit
};
type PayloadTranslatorFunc = (payload: { [key: string]: any }, utils: {
  modelType: string,
  modelID: string,
  getState: () => { [key: string]: any },
  getGlobalState: () => { [key: string]: any },
  getModelList: () => { [modelType: string]: Array<string> }
}) => { [key: string]: any };

function factory(path: string, stream?: Array<ActionObject>): OriginalActionObject<TranslatorRetObj>
function factory(
  path: string,
  translator: PayloadTranslatorFunc,
  options?: FetchOptions
): OriginalActionObject<TranslatorRetObj>;
function factory(
  path: string,
  translator: PayloadTranslatorFunc,
  stream: Array<ActionObject>,
  options?: FetchOptions
): OriginalActionObject<TranslatorRetObj>;
function factory(
  path: string,
  arg0?: PayloadTranslatorFunc | Array<ActionObject>,
  arg1?: Array<ActionObject> | FetchOptions,
  arg2?: FetchOptions
): OriginalActionObject<TranslatorRetObj> {
  if (Array.isArray(arg0)) return {
    platform: 'webClient',
    pkg: 'preset',
    type: 'fetch',
    args: {
      path,
      stream: arg0,
      options: arg1 as FetchOptions || {}
    }
  };
  else if (Array.isArray(arg1)) return {
    platform: 'webClient',
    pkg: 'preset',
    type: 'fetch',
    args: {
      path,
      translator: arg0,
      stream: arg1,
      options: arg2 || {}
    }
  };
}

export default factory;
