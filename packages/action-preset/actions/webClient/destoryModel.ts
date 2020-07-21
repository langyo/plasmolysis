import {
  ActionObject
} from '../../../core/type';
import {
  WebClientGlobalContext,
  WebClientLocalContext
} from "../../contexts/webClient/modelManager";


interface GeneratorRetObj {
  id: string
};
interface TranslatorRetObj {
  generator: (...args: any[]) => GeneratorRetObj
};
type GeneratorFunc = (payload: object, utils: {
  modelType: string,
  modelID: string,
  getState: () => object,
  getGlobalState: () => object,
  getModelList: () => { [modelType: string]: Array<string> }
}) => GeneratorRetObj;

export function translator(func: GeneratorFunc): ActionObject<TranslatorRetObj>;
export function translator(id: string): ActionObject<TranslatorRetObj>;
export function translator(arg0: GeneratorFunc | string): ActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'string') return {
    disc:'ActionObject',
    platform: 'webClient',
    type: 'destoryModel',
    args: { generator: () => ({ id: arg0 }) }
  }
  else return {
    disc:'ActionObject',
    platform: 'webClient',
    type: 'destoryModel',
    args: { generator: arg0 }
  }
};

export function executor({ generator }: TranslatorRetObj) {
  return async (payload: object, {
    getState,
    getGlobalState,
    getModelList,
    destoryModel
  }: WebClientGlobalContext, {
    modelType,
    modelID
  }: WebClientLocalContext) => {
    const { id } = (<GeneratorFunc>generator)
      (payload, {
        getState: () => getState(modelID),
        getGlobalState,
        getModelList,
        modelType,
        modelID
      });
    destoryModel(id);
    return payload;
  };
};
