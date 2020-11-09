export interface IGetters {
  modelType: string,
  modelID: string,
  state: { [key: string]: any },
  globalState: { [key: string]: any },
  pageType: string,
  modelList: { [modelType: string]: string[] }
};

export { createModel } from './lib/model/createModel';
export { destoryModel } from './lib/model/destoryModel';
export { setGlobalState } from './lib/model/setGlobalState';
export { setState } from './lib/model/setState';

export * as modelManager from './modelManager';
export * as stateManager from './stateManager';
