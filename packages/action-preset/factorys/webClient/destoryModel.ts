
interface GeneratorRetObj {
  id: string
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
function factory(id: string): TranslatorRetObj;
function factory(arg0: GeneratorFunc | string): TranslatorRetObj {
  if (typeof arg0 === 'string') return { generator: () => ({ id: arg0 }) };
  else return { generator: arg0 };
};

export default factory;
