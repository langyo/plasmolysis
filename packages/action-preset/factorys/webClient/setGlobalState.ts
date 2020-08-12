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

function factory(func: GeneratorFunc): OriginalActionObject<TranslatorRetObj>;
function factory(combinedObj: { [key: string]: any }): OriginalActionObject<TranslatorRetObj>;
function factory(arg0: GeneratorFunc | { [key: string]: any }): OriginalActionObject<TranslatorRetObj> {
  if (typeof arg0 === 'object') return {
    platform: 'webClient',
    pkg: 'preset',
    type: 'setGoobalState',
    args: { generator: () => arg0 }
  };
  else return {
    platform: 'webClient',
    pkg: 'preset',
    type: 'setGlobalState',
    args: { generator: arg0 }
  };
};

export default factory;
