import {
  ActionInfo,
  ActionObject,
  WebClientGlobalContext,
  WebClientLocalContext
} from '../type';

interface GeneratorObject {
  type: string,
  initState?: object,
  name?: string
};
type GeneratorFunc = (payload: object, utils: {
  modelType: string,
  modelID: string,
  getState: () => object,
  getGlobalState: () => object,
  getModelList: () => { [modelType: string]: Array<string> }
}) => GeneratorObject;

function webClientTranslator(func: GeneratorFunc): ActionObject;
function webClientTranslator(type: string, initState: object, name: string): ActionObject;
function webClientTranslator(arg0: GeneratorFunc | string, arg1?: object, arg2?: string): ActionObject {
  if (typeof arg0 === 'string') return {
    type: 'createModel',
    args: { generator: () => ({ type: arg0, initState: arg1, name: arg2 }) }
  }
  else return {
    type: 'createModel',
    args: { generator: arg0 }
  }
};

function webClientExecutor({ generator }: { generator: GeneratorFunc }) {
  return async function (payload: object, {
    getState,
    getGlobalState,
    getModelList,
    createModel
  }: WebClientGlobalContext, {
    modelType,
    modelID
  }: WebClientLocalContext) {
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

export default <ActionInfo> {
  translator: {
    webClient: webClientTranslator
  },
  executor: {
    webClient: webClientExecutor
  }
};
