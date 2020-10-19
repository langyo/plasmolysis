import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../runtimeManager';

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
      return await runAction(task.type, task.args, payload, variants);
    } catch (err) {
      return await runAction(
        errTask.type, errTask.args, { payload, err }, variants
      );
    }
  }
)
