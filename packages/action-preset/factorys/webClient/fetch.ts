import {
  IOriginalActionObject
} from '../../type';

export interface ITranslatorRetObj {
  path: string,
  translator?: PayloadTranslatorFunc,
  stream?: IOriginalActionObject[],
  options?: IFetchOptions
};
interface IFetchOptions {
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
  stream?: IOriginalActionObject[]
): IOriginalActionObject<ITranslatorRetObj>
function fetch(
  path: string,
  translator: PayloadTranslatorFunc,
  options?: IFetchOptions
): IOriginalActionObject<ITranslatorRetObj>;
function fetch(
  path: string,
  translator: PayloadTranslatorFunc,
  stream: IOriginalActionObject[],
  options?: IFetchOptions
): IOriginalActionObject<ITranslatorRetObj>;
function fetch(
  path: string,
  arg0?: PayloadTranslatorFunc | IOriginalActionObject[],
  arg1?: IOriginalActionObject[] | IFetchOptions,
  arg2?: IFetchOptions
): IOriginalActionObject<ITranslatorRetObj> {
  if (Array.isArray(arg0)) {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'fetch',
      args: {
        path,
        stream: arg0,
        options: arg1 as IFetchOptions || {}
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
