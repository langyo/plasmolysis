import { IRuntimeObject, IPlatforms } from '../index';
import { runAction, registerAction } from '../runtimeManager';
import { getPlatform } from '../contextManager';
import { actionEnterEvent, actionLeaveEvent } from '../logManager';

export function sideonly(
  side: IPlatforms,
  task: IRuntimeObject
): IRuntimeObject {
  return {
    type: '*.sideonly',
    args: { side, task }
  };
}

registerAction(
  '*.sideonly',
  '*',
  ({ side, task }: { side: IPlatforms, task: IRuntimeObject }) => async (
    payload, variants
  ) => {
    if (side === getPlatform()) {
      actionEnterEvent(task.type, variants.entityId, payload);
      payload = await runAction(task.type, task.args, payload, variants);
      actionLeaveEvent(task.type, variants.entityId, payload);
    }
    return payload;
  }
)
