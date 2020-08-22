export interface TranslatorRetObj {
  generator: (...args: any[]) => { [key: string]: any }
};
type GeneratorFunc = (payload: { [key: string]: any }, utils: {
  modelType: string,
  modelID: string,
  getState: () => { [key: string]: any },
  getGlobalState: () => { [key: string]: any },
  getModelList: () => { [modelType: string]: string[] }
}) => { [key: string]: any };

function setState(func: GeneratorFunc): OriginalActionObject<TranslatorRetObj>;
function setState(
  combinedObj: { [key: string]: any }
): OriginalActionObject<TranslatorRetObj>;
function setState(
  arg0: GeneratorFunc | { [key: string]: any }
): OriginalActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'object') {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'setState',
      args: { generator: () => arg0 }
    };
  }
  else {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'setState',
      args: { generator: arg0 }
    };
  }
};

export { setState };
