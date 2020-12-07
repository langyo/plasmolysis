import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/actionManager';

export function pushContent(
  key: string, value: string
): IRuntimeObject {
  return {
    type: 'routes.pushContent',
    args: {
      key, value
    }
  };
};

registerAction(
  'routes.pushContent',
  'js.node',
  ({ }) => async (payload, { sessionID }) => {
    return payload;
  }
);
