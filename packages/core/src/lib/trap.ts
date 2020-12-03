import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../actionManager';
import { eventLog } from '../logManager';

export function trap(
  task: IRuntimeObject,
  errTask: IRuntimeObject
): IRuntimeObject {
  return {
    type: '*.sideonly',
    args: { task, errTask }
  };
}

registerAction(
  '*.trap',
  '*',
  ({ task, errTask }: {
    task: IRuntimeObject, errTask: IRuntimeObject
  }) => async (payload, variants) => {
    try {
      eventLog('actionEnter', task.type, variants.id);
      const ret = await runAction(task.type, task.args, payload, variants);
      eventLog('actionLeave', task.type, variants.id);
      return ret;
    } catch (err) {
      eventLog('actionCrash', errTask.type, variants.id);
      return await runAction(
        errTask.type, errTask.args, { payload, err }, variants
      );
    }
  }
)
