import { IRuntimeObject } from 'nickelcat';
import { IGetters } from '../../index';
import { getModelList } from '../../modelManager';
import { getGlobalState, getState } from '../../stateManager';
import { getPageType } from 'nickelcat-action-routes/routeManager';
import { generate } from 'shortid';

// TODO - How to input the variants?

export function createModel(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any },
    name?: string
  }
): string;
export function createModel(
  type: string,
  initState?: { [key: string]: any },
  name?: string
): string;
export function createModel(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    type: string,
    initState: { [key: string]: any },
    name?: string
  }) | string,
  arg1?: { [key: string]: any },
  arg2?: string
): string {
  const {
    type, initState, name
  } = typeof arg0 === 'string' ? {
    type: arg0, initState: arg1, name: arg2
  } : generator(payload, {
    state: getState(modelID),
    globalState: getGlobalState(),
    modelList: getModelList(),
    pageType: getPageType(),
    modelType,
    modelID
  });

  createModel(type, initState, name);
  return payload;
};

