import { IRuntimeObject } from '../index';
import { registerAction } from '../actionManager';

export function crash(reason: string): IRuntimeObject {
  return {
    type: '*.crash',
    args: { reason }
  };
}

// TODO - Add the position reference.
registerAction(
  '*.crash',
  '*',
  ({ reason }) => async (payload, variants) => {
    throw new Error(reason);
  }
)
