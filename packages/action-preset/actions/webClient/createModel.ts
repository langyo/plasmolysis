import {
  ActionObject
} from '../../../core/type';
import {
  WebClientGlobalContext,
  WebClientLocalContext
} from "../../contexts/webClient/modelManager";


import { generate } from 'shortid';

interface GeneratorRetObj {
  type: string,
  initState: object,
  name: string
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
export function translator(type: string, initState?: object, name?: string): ActionObject<TranslatorRetObj>;
export function translator(arg0: GeneratorFunc | string, arg1?: object, arg2?: string): ActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'string') return {
    disc: 'ActionObject',
    platform: 'webClient',
    type: 'createModel',
    args: { generator: () => ({ type: arg0, initState: arg1 || {}, name: arg2 || generate() }) }
  }
  else return {
    disc:'ActionObject',
    platform: 'webClient',
    type: 'createModel',
    args: { generator: arg0 }
  }
};

export function executor({ generator }: TranslatorRetObj) {
  return async (payload: object, {
    getState,
    getGlobalState,
    getModelList,
    createModel
  }: WebClientGlobalContext, {
    modelType,
    modelID
  }: WebClientLocalContext) => {
    const { type, initState, name } = (<GeneratorFunc>generator)
      (payload, {
        getState: () => getState(modelID),
        getGlobalState,
        getModelList,
        modelType,
        modelID
      });
    createModel(type, initState, name);
    return payload;
  };
};
