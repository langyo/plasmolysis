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

function factory(path: string, stream?: Array<ActionObject>): TranslatorRetObj
function factory(path: string, translator: PayloadTranslatorFunc, options?: FetchOptions): TranslatorRetObj;
function factory(path: string, translator: PayloadTranslatorFunc, stream: Array<ActionObject>, options?: FetchOptions): TranslatorRetObj;
function factory(
  path: string,
  arg0?: PayloadTranslatorFunc | Array<ActionObject>,
  arg1?: Array<ActionObject> | FetchOptions,
  arg2?: FetchOptions
): TranslatorRetObj {
  if (Array.isArray(arg0)) return {
    path,
    stream: arg0,
    options: arg1 as FetchOptions || {}
  };
  else if (Array.isArray(arg1)) return {
    path,
    translator: arg0,
    stream: arg1,
    options: arg2 || {}
  };
}

export default factory;
