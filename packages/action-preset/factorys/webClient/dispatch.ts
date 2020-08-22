interface GeneratorRetObj {
  id: string,
  action: string,
  payload: { [key: string]: any }
};
export interface TranslatorRetObj {
  generator: (...args: any[]) => GeneratorRetObj
};
type GeneratorFunc = (payload: { [key: string]: any }, utils: {
  modelType: string,
  modelID: string,
  getState: () => { [key: string]: any },
  getGlobalState: () => { [key: string]: any },
  getModelList: () => { [modelType: string]: string[] }
}) => GeneratorRetObj;

function dispatch(func: GeneratorFunc): OriginalActionObject<TranslatorRetObj>;
function dispatch(
  id: string,
  action: string,
  payload: { [key: string]: any }
): OriginalActionObject<TranslatorRetObj>;
function dispatch(
  arg0: GeneratorFunc | string,
  arg1?: string,
  arg2?: { [key: string]: any }
): OriginalActionObject<TranslatorRetObj> {
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
