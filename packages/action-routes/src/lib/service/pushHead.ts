import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/actionManager';

export function pushHead(
  key: string, value: string
): IRuntimeObject {
  return {
    type: 'routes.pushHead',
    args: {
      key, value
    }
  };
};

registerAction(
  'routes.pushHead',
  'js.node',
  ({ }) => async (payload, { sessionID }) => {
    return payload;
  }
);