import { IGetters } from '../../index';
import { getModelList } from '../../modelManager';
import { getGlobalState, getState } from '../../stateManager';
import { getPageType } from 'nickelcat-action-routes/routeManager';

// TODO - How to input the variants?

export function setGlobalState(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  }
): { [key: string]: any };
export function setGlobalState(
  combinedObj: { [key: string]: any }
): { [key: string]: any };
export function setGlobalState(
  arg0: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  } | { [key: string]: any }
): { [key: string]: any };
  const obj = typeof arg0 === 'function' ?generator(payload, {
    state: getState(modelID),
    globalState: getGlobalState(),
    modelList: getModelList(),
    pageType: getPageType(),
    modelType,
    modelID
  }) : arg0;

  setGlobalState(obj);
  return payload;
};

