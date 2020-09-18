import {
  IOriginalActionObject
} from '../../type';

interface IGeneratorRetObj {
  type: string,
  initState: { [key: string]: any }
};
export interface ITranslatorRetObj {
  generator: (...args: any[]) => IGeneratorRetObj
};
type (payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any },
    name?: string
  } = (payload: { [key: string]: any }, utils: {
  modelType: string,
  modelID: string,
  getState: () => { [key: string]: any },
  getGlobalState: () => { [key: string]: any },
  getModelList: () => { [modelType: string]: string[] }
}) => IGeneratorRetObj;

function togglePage(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any },
    name?: string
  }
): IActionEntity;
function togglePage(
  type: string,
  initState: { [key: string]: any }
): IActionEntity;
function togglePage(
  arg0: (payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any },
    name?: string
  } | string,
  arg1?: { [key: string]: any }
): IActionEntity {
  if (typeof arg0 === 'string') {
    return {
      type: 'togglePage',
      pkg: 'routes',
      platform: 'webClient',
      args: { generator: () => ({ type: arg0, initState: arg1 || {} }) }
    };
  }
  else {
    return {
      type: 'togglePage',
      pkg: 'routes',
      platform: 'webClient',
      args: arg0 as any
    };
  }
};

export { togglePage };
