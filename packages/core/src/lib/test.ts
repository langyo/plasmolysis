import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../actionManager';
import { actionEnterEvent, actionLeaveEvent } from '../logManager';

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
        actionEnterEvent(task.type, variants.entityId, payload);
        payload = await runAction(task.type, task.args, payload, variants);
        actionLeaveEvent(task.type, variants.entityId, payload);
      }
      return payload;
    }
)
