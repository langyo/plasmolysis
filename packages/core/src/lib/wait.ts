import { IRuntimeObject } from '../index';
import { registerAction } from '../runtimeManager';

export function wait(length: number): IRuntimeObject {
  return {
    type: '*.length',
    args: { length }
  };
}

registerAction(
  '*.length',
  '*',
  ({ length }: { length: number }) => async (payload) => {
    return new Promise(resolve => setTimeout(() => resolve(payload), length));
  }
)
