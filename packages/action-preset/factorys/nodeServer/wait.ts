interface GeneratorRetObj {
  length: number
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
function factory(length: number): TranslatorRetObj;
function factory(arg0: GeneratorFunc | number): TranslatorRetObj {
  if (typeof arg0 === 'number') return { generator: () => ({ length }) };
  else return { generator: arg0 };
};

export default factory;
