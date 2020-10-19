import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';

export function renderToStatic(
  key: string, value: string
): IRuntimeObject {
  return {
    type: 'routes.renderToStatic',
    args: {
      key, value
    }
  };
};

registerAction(
  'routes.renderToStatic',
  'js.node',
  ({ }) => async payload => {
    return payload;
  }
);
