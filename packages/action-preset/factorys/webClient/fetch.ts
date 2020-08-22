export interface TranslatorRetObj {
  path: string,
  translator?: PayloadTranslatorFunc,
  stream?: OriginalActionObject[],
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
  getModelList: () => { [modelType: string]: string[] },
  getPageType: () => string
}) => { [key: string]: any };

function fetch(
  path: string,
  stream?: OriginalActionObject[]
): OriginalActionObject<TranslatorRetObj>
function fetch(
  path: string,
  translator: PayloadTranslatorFunc,
  options?: FetchOptions
): OriginalActionObject<TranslatorRetObj>;
function fetch(
  path: string,
  translator: PayloadTranslatorFunc,
  stream: OriginalActionObject[],
  options?: FetchOptions
): OriginalActionObject<TranslatorRetObj>;
function fetch(
  path: string,
  arg0?: PayloadTranslatorFunc | OriginalActionObject[],
  arg1?: OriginalActionObject[] | FetchOptions,
  arg2?: FetchOptions
): OriginalActionObject<TranslatorRetObj> {
  if (Array.isArray(arg0)) {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'fetch',
      args: {
        path,
        stream: arg0,
        options: arg1 as FetchOptions || {}
      }
    };
  }
  else if (Array.isArray(arg1)) {
    return {
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
}

export { fetch };
