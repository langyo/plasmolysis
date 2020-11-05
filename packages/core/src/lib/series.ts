import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../runtimeManager';
import { actionEnterEvent, actionLeaveEvent } from '../logManager';

export function series(...tasks: IRuntimeObject[]): IRuntimeObject {
  return {
    type: '*.series',
    args: { tasks }
  };
}

registerAction(
  '*.series',
  '*',
  ({ tasks }: { tasks: IRuntimeObject[] }) => async (
    payload, variants
  ) => {
    for (const task of tasks) {
      if (typeof task !== 'undefined') {
        actionEnterEvent(task.type, variants.entityId, payload);
        payload = await runAction(task.type, task.args, payload, variants);
        actionLeaveEvent(task.type, variants.entityId, payload);
      }
    }
    return payload;
  }
)