import {
  IRuntimeObject
} from '../index';

export function dispatch(
  path: string
): IRuntimeObject {
  return (platform, { runtimeManager }) => async (
    payload, contexts, variants
  ) => {
    if (path.indexOf('.') < 0) {
      throw new Error(`Illegal path: ${path}`);
    }
    const tag = path.substr(path.indexOf('.'));
    const streamName = path.substr(path.indexOf('.') + 1, path.length);
    if (!runtimeManager.hasRuntime(tag, streamName)) {
      throw new Error(`Illegal path: ${path}`);
    }
    return await runtimeManager.runRuntime(
      tag, streamName, payload, variants
    );
  };
}