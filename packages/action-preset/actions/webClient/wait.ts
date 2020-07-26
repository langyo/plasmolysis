import {
  ActionNormalObject
} from '../../../core/type';
import {
  WebClientGlobalContext,
  WebClientLocalContext
} from "../../contexts/webClient/modelManager";

interface GeneratorRetObj {
  length: number
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

export function translator(func: GeneratorFunc): ActionNormalObject<TranslatorRetObj>;
export function translator(length: number): ActionNormalObject<TranslatorRetObj>;
export function translator(arg0: GeneratorFunc | number): ActionNormalObject<TranslatorRetObj> {
  if (typeof arg0 === 'number') return {
    kind:'ActionNormalObject',
    platform: 'webClient',
    type: 'wait',
    args: { generator: () => ({ length }) }
  }
  else return {
    kind:'ActionNormalObject',
    platform: 'webClient',
    type: 'wait',
    args: { generator: arg0 }
  }
};

export function executor({ generator }: TranslatorRetObj) {
  return async (payload: object, {
    getState,
    getGlobalState,
    getModelList
  }: WebClientGlobalContext, {
    modelType,
    modelID
  }: WebClientLocalContext) => {
    const { length } = (<GeneratorFunc>generator)
      (payload, {
        getState: () => getState(modelID),
        getGlobalState,
        getModelList,
        modelType,
        modelID
      });
    return await (new Promise(resolve =>
      setTimeout(() => resolve(payload), length)
    ));
  };
};
 