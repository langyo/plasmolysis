import {
  IOriginalActionObject
} from '../../type';

interface IGeneratorRetObj {
  id: string
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

function destoryModel(
  func: GeneratorFunc
): IOriginalActionObject<ITranslatorRetObj>;
function destoryModel(id: string): IOriginalActionObject<ITranslatorRetObj>;
function destoryModel(
  arg0: GeneratorFunc | string
): IOriginalActionObject<ITranslatorRetObj> {
  if (typeof arg0 === 'string') {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'destoryModel',
      args: { generator: () => ({ id: arg0 }) }
    };
  }
  else {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'destoryModel',
      args: { generator: arg0 }
    };
  }
};

export { destoryModel };
