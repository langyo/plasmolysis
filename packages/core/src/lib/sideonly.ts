import { IRuntimeObject, IPlatforms } from '../index';
import { runAction, registerAction } from '../runtimeManager';
import { getPlatform } from '../contextManager';

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
      payload = await runAction(task.type, task.args, payload, variants);
    }
    return payload;
  }
)
