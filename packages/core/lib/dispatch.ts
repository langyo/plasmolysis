import {
  IPlatforms,
  IRuntime
} from '../index';

export function dispatch(
  path: string,
  platform?: IPlatforms
): IRuntime {
  return (platform, publicContexts) => async (
    payload, contexts, variants
  ) => {
    return payload;
  };
}