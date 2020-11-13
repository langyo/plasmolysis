import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/actionManager';
import { IGetters } from '../../index';
import { getModelList } from '../../modelManager';
import {
  getGlobalState,
  getState
} from '../../stateManager';
import { getPageType } from 'nickelcat-action-routes/routeManager';

export function setGlobalState(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  }
): IRuntimeObject;
export function setGlobalState(
  combinedObj: { [key: string]: any }
): IRuntimeObject;
export function setGlobalState(
  arg0: (payload: { [key: string]: any }, utils: IGetters) => {
    [key: string]: any
  } | { [key: string]: any }
): IRuntimeObject {
  return {
    type: 'preset.setGlobalState',
    args: {
      generator: typeof arg0 === 'string' ? () => ({ id: arg0 }) : arg0
    }
  };
};

registerAction(
  'preset.setGlobalState',
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
    setGlobalState(obj);
    return payload;
  }
);
