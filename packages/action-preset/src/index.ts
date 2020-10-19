export interface IGetters {
  modelType: string,
  modelID: string,
  state: { [key: string]: any },
  globalState: { [key: string]: any },
  pageType: string,
  modelList: { [modelType: string]: string[] }
};

export { createModel } from './lib/createModel';
export { destoryModel } from './lib/destoryModel';
export { setGlobalState } from './lib/setGlobalState';
export { setState } from './lib/setState';

export * as modelManager from './modelManager';
export * as stateManager from './stateManager';
