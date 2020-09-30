import {
  IRuntime
} from '../index';

export function wait(
  length: number
): IRuntime {
  return () => async (
    payload
  ) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(payload)
      }, length);
    });
  };
}