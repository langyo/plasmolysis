import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';

export function pushContent(
  key: string, value: string
): IRuntimeObject {
  return {
    type: 'routes.routeToService',
    args: {
      key, value
    }
  };
};

registerAction(
  'routes.routeToService',
  'js.node',
  ({ }) => async payload => {
    return payload;
  }
);
