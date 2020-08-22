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
  getModelList: () => { [modelType: string]: string[] }
}) => GeneratorRetObj;

function destoryModel(
  func: GeneratorFunc
): OriginalActionObject<TranslatorRetObj>;
function destoryModel(id: string): OriginalActionObject<TranslatorRetObj>;
function destoryModel(
  arg0: GeneratorFunc | string
): OriginalActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'string') {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'destoryModel',
      args: { generator: () => ({ id: arg0 }) }
    };
  }
  else {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'destoryModel',
      args: { generator: arg0 }
    };
  }
};

export { destoryModel };
