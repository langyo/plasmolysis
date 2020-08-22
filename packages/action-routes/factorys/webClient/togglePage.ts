import {
  IOriginalActionObject
} from '../../type';

interface IGeneratorRetObj {
  type: string,
  initState: { [key: string]: any }
};
export interface ITranslatorRetObj {
  generator: (...args: any[]) => IGeneratorRetObj
};
type GeneratorFunc = (payload: { [key: string]: any }, utils: {
  modelType: string,
  modelID: string,
  getState: () => { [key: string]: any },
  getGlobalState: () => { [key: string]: any },
  getModelList: () => { [modelType: string]: string[] }
}) => IGeneratorRetObj;

function togglePage(
  func: GeneratorFunc
): IOriginalActionObject<ITranslatorRetObj>;
function togglePage(
  type: string,
  initState: { [key: string]: any }
): IOriginalActionObject<ITranslatorRetObj>;
function togglePage(
  arg0: GeneratorFunc | string,
  arg1?: { [key: string]: any }
): IOriginalActionObject<ITranslatorRetObj> {
  if (typeof arg0 === 'string') {
    return {
      type: 'togglePage',
      pkg: 'routes',
      platform: 'webClient',
      args: { generator: () => ({ type: arg0, initState: arg1 || {} }) }
    };
  }
  else {
    return {
      type: 'togglePage',
      pkg: 'routes',
      platform: 'webClient',
      args: arg0 as any
    };
  }
};

export { togglePage };
