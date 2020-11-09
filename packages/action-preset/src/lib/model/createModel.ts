import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';
import { IGetters } from '../../index';
import { getModelList } from '../../modelManager';
import {
  getGlobalState,
  getState
} from '../../stateManager';
import { getPageType } from 'nickelcat-action-routes/routeManager';
import { generate } from 'shortid';

export function createModel(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any },
    name?: string
  }
): IRuntimeObject;
export function createModel(
  type: string,
  initState?: { [key: string]: any },
  name?: string
): IRuntimeObject;
export function createModel(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any },
    name?: string
  }) | string,
  arg1?: { [key: string]: any },
  arg2?: string
): IRuntimeObject {
  const generator = typeof arg0 === 'string' ? () => ({
    type: arg0,
    initState: arg1 || {},
    name: arg2 || generate()
  }) : arg0;

  return {
    type: 'preset.createModel',
    args: { generator }
  };
};

registerAction(
  'preset.createModel',
  'js.browser',
  ({ generator }) => async (
    payload, {
      modelType, modelID
    }
  ) => {
    const { type, initState, name } = generator(payload, {
      state: getState(modelID),
      globalState: getGlobalState(),
      modelList: getModelList(),
      pageType: getPageType(),
      modelType,
      modelID
    });
    createModel(type, initState, name);
    return payload;
  }
);
