import {
  setGlobalState as wrappedSetGlobalState
} from '../../stateManager';

export function setGlobalState(
  obj: { [key: string]: any }
) {
  wrappedSetGlobalState(obj);
};

