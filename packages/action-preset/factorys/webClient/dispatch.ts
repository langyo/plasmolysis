import {
  IOriginalActionObject
} from '../../type';

interface IGeneratorRetObj {
  id: string,
  action: string,
  payload: { [key: string]: any }
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

function dispatch(
  func: GeneratorFunc
): IOriginalActionObject<ITranslatorRetObj>;
function dispatch(
  id: string,
  action: string,
  payload: { [key: string]: any }
): IOriginalActionObject<ITranslatorRetObj>;
function dispatch(
  arg0: GeneratorFunc | string,
  arg1?: string,
  arg2?: { [key: string]: any }
): IOriginalActionObject<ITranslatorRetObj> {
  if (typeof arg0 === 'string') {
    if (typeof arg1 !== 'string') {
      throw new Error('You must provide a string as the action name.');
    }
    if (typeof arg2 !== 'object') {
      throw new Error('You must provide an{ [key: string]: any } as the payload.');
    }
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'dispatch',
      args: { generator: () => ({ id: arg0, action: arg1, payload: arg2 }) }
    };
  }
  else {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'dispatch',
      args: { generator: arg0 }
    };
  }
};

export { dispatch };
