import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';

export function renderComponent(
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
  ({ }) => async (payload, { sessionID }) => {
    return payload;
  }
);

registerAction(
  'routes.renderComponent',
  'js.browser',
  ({ }) => async payload => {
    return payload;
  }
);
