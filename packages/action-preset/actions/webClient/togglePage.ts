import {
  ActionObject
} from '../../../core/type';
import {
  WebClientGlobalContext,
  WebClientLocalContext
} from "../../contexts/webClient/modelManager";


interface GeneratorRetObj {
  type: string,
  initState: object
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
export function translator(type: string, initState: object): ActionObject<TranslatorRetObj>;
export function translator(arg0: GeneratorFunc | string, arg1?: object): ActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'string') {
    return {
      type: 'togglePage',
      args: { generator: () => ({ type: arg0, initState: arg1 || {} }) }
    };
  }
  else return {
    type: 'togglePage',
    args: { generator: arg0 }
  }
};

export function executor({ generator }: TranslatorRetObj) {
  return async (payload: object, {
    getState,
    getGlobalState,
    getModelList,
    setGlobalState,
    createModel,
    destoryModel
  }: WebClientGlobalContext, {
    modelType,
    modelID
  }: WebClientLocalContext) => {
    const { type, initState } = (<GeneratorFunc>generator)
      (payload, {
        getState: () => getState(modelID),
        getGlobalState,
        getModelList,
        modelType,
        modelID
      });

    if (getGlobalState().$pageType) destoryModel(getGlobalState().$pageID);
    const pageID = createModel(type, initState);
    setGlobalState({ $pageType: type, $pageID: pageID });
    window.history.pushState(initState, '', `${type}${
      initState && typeof initState === 'object' && Object.keys(initState).length > 0 ?
        `?${
        Object.keys(initState)
          .map(key => `${key}=${
            (
              typeof initState[key] === 'object'
              || Array.isArray(initState[key])
            ) && encodeURI(JSON.stringify(initState[key]))
            || initState[key]
            }`)
          .join('&')
        }` : ''
      }`);

    return payload;
  }
}
