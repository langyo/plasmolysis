import {
  destoryModel as wrappedDestoryModel
} from '../../stateManager';

export function destoryModel(id: string): void {
  wrappedDestoryModel(id);
};
