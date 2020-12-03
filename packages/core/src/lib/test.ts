import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../actionManager';
import { eventLog } from '../logManager';

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
        eventLog('actionEnter', task.type, variants.id);
        payload = await runAction(task.type, task.args, payload, variants);
        eventLog('actionLeave', task.type, variants.id);
      }
      return payload;
    }
)
