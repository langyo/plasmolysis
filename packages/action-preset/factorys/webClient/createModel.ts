import {
  IOriginalActionObject
} from '../../type';
import { generate } from 'shortid';

interface IGeneratorRetObj {
  type: string,
  initState: { [key: string]: any },
  name: string
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

function createModel(
  func: GeneratorFunc
): IOriginalActionObject<ITranslatorRetObj>;
function createModel(
  type: string,
  initState?: { [key: string]: any },
  name?: string
): IOriginalActionObject<ITranslatorRetObj>;
function createModel(
  arg0: GeneratorFunc | string,
  arg1?: { [key: string]: any },
  arg2?: string
): IOriginalActionObject<ITranslatorRetObj> {
  if (typeof arg0 === 'string') {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'createModel',
      args: {
        generator: () => ({
          type: arg0,
          initState: arg1 || {},
          name: arg2 || generate()
        })
      }
    };
  }
  else {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'createModel',
      args: { generator: arg0 }
    };
  }
};

export { createModel };
