import { IGetters } from '../../index';
import { getModelList } from '../../modelManager';
import { getGlobalState, getState } from '../../stateManager';
import { getPageType } from 'nickelcat-action-routes/routeManager';

// TODO - How to input the variants?

export function destoryModel(
  func: (payload: { [key: string]: any }, utils: IGetters) => {
    id: string
  }
): void;
export function destoryModel(id: string): void;
export function destoryModel(
  arg0: ((payload: { [key: string]: any }, utils: IGetters) => {
    id: string
  }) | string
): void {
  const { id } = typeof arg0 === 'string' ? { id: arg0 } : generator(payload, {
    state: getState(modelID),
    globalState: getGlobalState(),
    modelList: getModelList(),
    pageType: getPageType(),
    modelType,
    modelID
  });

  destoryModel(id);
};

