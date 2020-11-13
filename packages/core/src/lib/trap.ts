import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../actionManager';
import {
  actionEnterEvent, actionLeaveEvent, actionCrashEvent
} from '../logManager';

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
      actionEnterEvent(task.type, variants.entityId, payload);
      const ret = await runAction(task.type, task.args, payload, variants);
      actionLeaveEvent(task.type, variants.entityId, payload);
      return ret;
    } catch (err) {
      actionCrashEvent(errTask.type, variants.entityId, payload);
      return await runAction(
        errTask.type, errTask.args, { payload, err }, variants
      );
    }
  }
)
