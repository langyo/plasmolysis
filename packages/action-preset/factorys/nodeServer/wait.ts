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
  getModelList: () => { [modelType: string]: string[] }
}) => GeneratorRetObj;

function wait(func: GeneratorFunc): OriginalActionObject<TranslatorRetObj>;
function wait(length: number): OriginalActionObject<TranslatorRetObj>;
function wait(
  arg0: GeneratorFunc | number
): OriginalActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'number') {
    return {
      platform: 'nodeServer',
      pkg: 'preset',
      type: 'wait',
      args: { generator: () => ({ length }) }
    };
  }
  else {
    return {
      platform: 'nodeServer',
      pkg: 'preset',
      type: 'wait',
      args: { generator: arg0 }
    };
  }
};

export { wait };
