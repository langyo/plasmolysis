import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../actionManager';
import { eventLog } from '../logManager';

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
        eventLog('actionEnter', task.type, variants.id);
        payload = await runAction(task.type, task.args, payload, variants);
        eventLog('actionLeave', task.type, variants.id);
      }
    }
    return payload;
  }
)
