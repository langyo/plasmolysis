import {
  IPlatforms,
  IRuntimeObject
} from '../index';

export function sideonly(
  specPlatform: IPlatforms,
  task: IRuntimeObject
): IRuntimeObject {
  return (platform, publicContexts) => async (
    payload, contexts, variants
  ) => {
    if (specPlatform === platform) {
      payload = await task(
        platform, publicContexts
      )(payload, contexts, variants);
    }
    return payload;
  };
}