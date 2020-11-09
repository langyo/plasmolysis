import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';
import { IGetters } from '../../index';
import { getModelList } from '../../modelManager';
import {
  getGlobalState,
  getState
} from '../../stateManager';
import { getPageType } from 'nickelcat-action-routes/routeManager';

export function destoryModel(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    id: string
  }
): IRuntimeObject;
export function destoryModel(id: string): IRuntimeObject;
export function destoryModel(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    id: string
  }) | string
): IRuntimeObject {
  return {
    type: 'preset.destoryModel',
    args: {
      generator: typeof arg0 === 'string' ? () => ({ id: arg0 }) : arg0
    }
  };
};

registerAction(
  'preset.destoryModel',
  'js.browser',
  ({ generator }) => async (
    payload, {
      modelType, modelID
    }
  ) => {
    const { id } = generator(payload, {
      state: getState(modelID),
      globalState: getGlobalState(),
      modelList: getModelList(),
      pageType: getPageType(),
      modelType,
      modelID
    });
    destoryModel(id);
    return payload;
  }
);