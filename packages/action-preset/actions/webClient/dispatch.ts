import {
  ActionObject
} from '../../../core/type';
import {
  WebClientGlobalContext,
  WebClientLocalContext
} from "../../contexts/webClient/modelManager";


interface GeneratorRetObj {
  id: string,
  action: string,
  payload: object
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
export function translator(id: string, action: string, payload: object): ActionObject<TranslatorRetObj>;
export function translator(arg0: GeneratorFunc | string, arg1?: string, arg2?: object): ActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'string') {
    if (typeof arg1 !== 'string') throw new Error('You must provide a string as the action name.');
    if (typeof arg2 !== 'object') throw new Error('You must provide an object as the payload.');
    return {
      disc:'ActionObject',
      platform: 'webClient',
      type: 'dispatch',
      args: { generator: () => ({ id: arg0, action: arg1, payload: arg2 }) }
    };
  }
  else return {
    disc:'ActionObject',
    platform: 'webClient',
    type: 'dispatch',
    args: { generator: arg0 }
  }
};

export function executor({ generator }: TranslatorRetObj) {
  return async (payload: object, {
    getState,
    getGlobalState,
    getModelList,
    evaluateModelAction
  }: WebClientGlobalContext, {
    modelType,
    modelID
  }: WebClientLocalContext) => {
    const { id, action, payload: retPayload } = (<GeneratorFunc>generator)
      (payload, {
        getState: () => getState(modelID),
        getGlobalState,
        getModelList,
        modelType,
        modelID
      });
    evaluateModelAction(id, action, retPayload);
    return payload;
  }
}