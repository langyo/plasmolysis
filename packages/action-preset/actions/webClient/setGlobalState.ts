import {
  ActionNormalObject
} from '../../../core/type';
import {
  WebClientGlobalContext,
  WebClientLocalContext
} from "../../contexts/webClient/modelManager";


type GeneratorFunc = (payload: object, utils: {
  modelType: string,
  modelID: string,
  getState: () => object,
  getGlobalState: () => object,
  getModelList: () => { [modelType: string]: Array<string> }
}) => object;

export function translator(func: GeneratorFunc): ActionNormalObject<object>;
export function translator(combinedObj: object): ActionNormalObject<object>;
export function translator(arg0: GeneratorFunc | object): ActionNormalObject<object> {
  if (typeof arg0 === 'object') return {
    kind:'ActionNormalObject',
    platform: 'webClient',
    type: 'setGlobalState',
    args: { generator: () => arg0 }
  }
  else return {
    kind:'ActionNormalObject',
    platform: 'webClient',
    type: 'setGlobalState',
    args: { generator: arg0 }
  }
};

export function executor({ generator }: { generator: GeneratorFunc }) {
  return async (payload: object, {
    getState,
    getGlobalState,
    getModelList,
    setGlobalState
  }: WebClientGlobalContext, {
    modelType,
    modelID
  }: WebClientLocalContext) => {
    const ret = (<GeneratorFunc>generator)
      (payload, {
        getState: () => getState(modelID),
        getGlobalState,
        getModelList,
        modelType,
        modelID
      });
    setGlobalState(ret);
    return payload;
  }
}
