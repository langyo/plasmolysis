import { IRuntimeObject } from '../index';
import { hasRuntime, runRuntime, registerAction } from '../runtimeManager';

export function dispatch(
  path: string
): IRuntimeObject {
  if (path.indexOf('.') < 0) {
    throw new Error(`Illegal path: ${path}`);
  }
  const tag = path.substr(path.indexOf('.'));
  const name = path.substr(path.indexOf('.') + 1, path.length);
  return {
    type: '*.dispatch',
    args: { tag, name }
  };
}

registerAction(
  '*.dispatch',
  '*',
  ({ tag, name }) => async (
    payload, variants
  ) => {
    if (!hasRuntime(tag, name)) {
      throw new Error(`Illegal path: ${tag}.${name}`);
    }
    return await runRuntime(
      tag, name, payload, variants
    );
  }
);
