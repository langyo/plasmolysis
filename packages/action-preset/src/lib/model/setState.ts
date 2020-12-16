import {
  setState as wrappedSetState
} from '../../stateManager';

export function setState(
  obj: { [key: string]: any }
): { [key: string]: any } {
  wrappedSetState(this.modelID, obj);
  return payload;
}

