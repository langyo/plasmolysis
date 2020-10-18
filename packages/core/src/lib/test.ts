import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../runtimeManager';

export function test(
  testFunc: (
    payload: { [key: string]: any },
    variants: { [key: string]: any }
  ) => boolean,
  task: IRuntimeObject
): IRuntimeObject {
  return {
    type: '*.task',
    args: { testFunc, task }
  };
}

registerAction(
  '*.task',
  '*',
  ({ testFunc, task }: {
    testFunc: (
      payload: { [key: string]: any },
      variants: { [key: string]: any }
    ) => boolean, task: IRuntimeObject
  }) => async (payload, variants) => {
      if (testFunc(payload, variants)) {
        payload = await runAction(task.type, task.args, payload, variants);
      }
      return payload;
    }
)
