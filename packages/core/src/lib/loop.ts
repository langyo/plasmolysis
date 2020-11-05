import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../runtimeManager';
import { actionEnterEvent, actionLeaveEvent } from '../logManager';

export function loop(
  testFunc: (
    payload: { [key: string]: any },
    variants: { [key: string]: any }
  ) => boolean,
  task: IRuntimeObject
): IRuntimeObject {
  return {
    type: '*.loop',
    args: { testFunc, task }
  };
}

registerAction(
  '*.loop',
  '*',
  ({ testFunc, task }: {
    testFunc: (
      payload: { [key: string]: any },
      variants: { [key: string]: any }
    ) => boolean, task: IRuntimeObject
  }) => async (payload, variants) => {
    while (testFunc(payload, variants)) {
      actionEnterEvent(task.type, variants.entityId, payload);
      payload = await runAction(task.type, task.args, payload, variants);
      actionLeaveEvent(task.type, variants.entityId, payload);
    }
    return payload;
  }
)
