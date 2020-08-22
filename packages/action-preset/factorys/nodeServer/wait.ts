import {
  IOriginalActionObject
} from '../../type';

interface IGeneratorRetObj {
  length: number
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

function wait(func: GeneratorFunc): IOriginalActionObject<ITranslatorRetObj>;
function wait(length: number): IOriginalActionObject<ITranslatorRetObj>;
function wait(
  arg0: GeneratorFunc | number
): IOriginalActionObject<ITranslatorRetObj> {
  if (typeof arg0 === 'number') {
    return {
      platform: 'nodeServer',
      pkg: 'preset',
      type: 'wait',
      args: { generator: () => ({ length }) }
    };
  }
  else {
    return {
      platform: 'nodeServer',
      pkg: 'preset',
      type: 'wait',
      args: { generator: arg0 }
    };
  }
};

export { wait };
