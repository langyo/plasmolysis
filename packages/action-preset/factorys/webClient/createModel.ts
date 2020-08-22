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
  getModelList: () => { [modelType: string]: string[] }
}) => GeneratorRetObj;

function createModel(
  func: GeneratorFunc
): OriginalActionObject<TranslatorRetObj>;
function createModel(
  type: string,
  initState?: { [key: string]: any },
  name?: string
): OriginalActionObject<TranslatorRetObj>;
function createModel(
  arg0: GeneratorFunc | string,
  arg1?: { [key: string]: any },
  arg2?: string
): OriginalActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'string') {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'createModel',
      args: {
        generator: () => ({
          type: arg0,
          initState: arg1 || {},
          name: arg2 || generate()
        })
      }
    };
  }
  else {
    return {
      platform: 'webClient',
      pkg: 'preset',
      type: 'createModel',
      args: { generator: arg0 }
    };
  }
};

export { createModel };