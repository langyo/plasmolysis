type GeneratorFunc = (payload: object, utils: {
  modelType: string,
  modelID: string,
  getState: () => object,
  getGlobalState: () => object,
  getModelList: () => { [modelType: string]: Array<string> }
}) => object;

export function translator(func: GeneratorFunc): ActionObject<object>;
export function translator(combinedObj: object): ActionObject<object>;
export function translator(arg0: GeneratorFunc | object): ActionObject<object> {
  if (typeof arg0 === 'object') return {
    type: 'setGlobalState',
    args: { generator: () => arg0 }
  }
  else return {
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
