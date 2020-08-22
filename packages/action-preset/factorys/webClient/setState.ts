import {
  IOriginalActionObject
} from '../../type';

export interface ITranslatorRetObj {
  generator: (...args: any[]) => { [key: string]: any }
};
type GeneratorFunc = (payload: { [key: string]: any }, utils: {
  modelType: string,
  modelID: string,
  getState: () => { [key: string]: any },
  getGlobalState: () => { [key: string]: any },
  getModelList: () => { [modelType: string]: string[] }
}) => { [key: string]: any };

function setState(
  func: GeneratorFunc
): IOriginalActionObject<ITranslatorRetObj>;
function setState(
  combinedObj: { [key: string]: any }
): IOriginalActionObject<ITranslatorRetObj>;
function setState(
  arg0: GeneratorFunc | { [key: string]: any }
): IOriginalActionObject<ITranslatorRetObj> {
  if (typeof arg0 === 'object') {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'setState',
      args: { generator: () => arg0 }
    };
  }
  else {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'setState',
      args: { generator: arg0 }
    };
  }
};

export { setState };
