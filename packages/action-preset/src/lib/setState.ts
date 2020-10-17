import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';
import { IGetters } from '../index';
import { getModelList } from '../modelManager';
import {
  getGlobalState,
  getState,
  setState as wrappedSetState
} from '../stateManager';
import { getPageType } from 'nickelcat-action-routes/routeManager';

export function setState(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  }
): IRuntimeObject;
export function setState(
  combinedObj: { [key: string]: any }
): IRuntimeObject;
export function setState(
  arg0: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  } | { [key: string]: any }
): IRuntimeObject {
  return {
    type: 'preset.setState',
    args: {
      generator: typeof arg0 === 'string' ? () => arg0 : arg0
    }
  };
};

registerAction(
  'preset.setState',
  'js.browser',
  ({ generator }) => async (
    payload, {
      modelType, modelID
    }) => {
    const obj = generator(payload, {
      state: getState(modelID),
      globalState: getGlobalState(),
      modelList: getModelList(),
      pageType: getPageType(),
      modelType,
      modelID
    });
    wrappedSetState(modelID, obj);
    return payload;
  }
);
