export interface TranslatorRetObj {
  generator: (...args: any[]) => { [key: string]: any }
};
type GeneratorFunc = (payload: { [key: string]: any }, utils: {
  modelType: string,
  modelID: string,
  getState: () => { [key: string]: any },
  getGlobalState: () => { [key: string]: any },
  getModelList: () => { [modelType: string]: Array<string> }
}) => { [key: string]: any };

function factory(func: GeneratorFunc): TranslatorRetObj;
function factory(combinedObj: { [key: string]: any }): TranslatorRetObj;
function factory(arg0: GeneratorFunc | { [key: string]: any }): TranslatorRetObj {
  if (typeof arg0 === 'object') return { generator: () => arg0 };
  else return { generator: arg0 };
};

export default factory;
