import {
  IRuntimeObject
} from '../index';

export function wait(
  length: number
): IRuntimeObject {
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