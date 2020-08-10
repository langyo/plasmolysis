import { generate } from 'shortid';

interface GeneratorRetObj {
  type: string,
  initState: { [key: string]: any },
  name: string
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
function factory(type: string, initState?: { [key: string]: any }, name?: string): TranslatorRetObj;
function factory(arg0: GeneratorFunc | string, arg1?: { [key: string]: any }, arg2?: string): TranslatorRetObj {
  if (typeof arg0 === 'string') return { generator: () => ({ type: arg0, initState: arg1 || {}, name: arg2 || generate() }) };
  else return { generator: arg0 };
};

export default factory;
