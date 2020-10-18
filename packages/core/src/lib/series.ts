import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../runtimeManager';

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
        payload = await runAction(task.type, task.args, payload, variants);
      }
    }
    return payload;
  }
)