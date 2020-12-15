import { IGetters } from '../../index';
import { getModelList } from '../../modelManager';
import {
  getGlobalState,
  getState,
  setState as wrappedSetState
} from '../../stateManager';
import { getPageType } from 'nickelcat-action-routes/routeManager';

// TODO - How to input the variants?

export function setState(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  }
): { [key: string]: any };
export function setState(
  combinedObj: { [key: string]: any }
): { [key: string]: any };
export function setState(
  arg0: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  } | { [key: string]: any }
): { [key: string]: any } {
  const obj = typeof arg0 === 'function' ? generator(payload, {
    state: getState(modelID),
    globalState: getGlobalState(),
    modelList: getModelList(),
    pageType: getPageType(),
    modelType,
    modelID
  }) : arg0;
  wrappedSetState(modelID, obj);
  return payload;
}

