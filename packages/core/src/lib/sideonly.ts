import { IRuntimeObject, IPlatforms } from '../index';
import { runAction, registerAction } from '../actionManager';
import { getPlatform } from '../contextManager';
import { eventLog } from '../logManager';

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
      eventLog('actionEnter', task.type, variants.id);
      payload = await runAction(task.type, task.args, payload, variants);
      eventLog('actionLeave', task.type, variants.id);
    }
    return payload;
  }
)
