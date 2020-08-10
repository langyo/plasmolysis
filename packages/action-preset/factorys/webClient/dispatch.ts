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
  getModelList: () => { [modelType: string]: Array<string> }
}) => GeneratorRetObj;

function factory(func: GeneratorFunc): TranslatorRetObj;
function factory(id: string, action: string, payload: { [key: string]: any }): TranslatorRetObj;
function factory(arg0: GeneratorFunc | string, arg1?: string, arg2?: { [key: string]: any }): TranslatorRetObj {
  if (typeof arg0 === 'string') {
    if (typeof arg1 !== 'string') throw new Error('You must provide a string as the action name.');
    if (typeof arg2 !== 'object') throw new Error('You must provide an{ [key: string]: any } as the payload.');
    return { generator: () => ({ id: arg0, action: arg1, payload: arg2 }) };
  }
  else return { generator: arg0 };
};

export default factory;
