interface GeneratorRetObj {
  type: string,
  initState: { [key: string]: any }
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

function togglePage(func: GeneratorFunc): TranslatorRetObj;
function togglePage(
  type: string,
  initState: { [key: string]: any }
): TranslatorRetObj;
function togglePage(
  arg0: GeneratorFunc | string,
  arg1?: { [key: string]: any }
): TranslatorRetObj {
  if (typeof arg0 === 'string') {
    return { generator: () => ({ type: arg0, initState: arg1 || {} }) };
  }
  else {
    return { generator: arg0 };
  }
};

export { togglePage };
