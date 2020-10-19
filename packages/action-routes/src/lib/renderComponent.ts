import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';

export function pushContent(
  key: string, value: string
): IRuntimeObject {
  return {
    type: 'routes.renderComponent',
    args: {
      key, value
    }
  };
};

registerAction(
  'routes.renderComponent',
  'js.node',
  ({ }) => async payload => {
    return payload;
  }
);
