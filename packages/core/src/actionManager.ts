import {
  IRuntimeFunc,
  IPlatforms
} from './index';
import { getPlatform } from './contextManager';

let actions: { [actionName: string]: IRuntimeFunc } = {};
let actionPlatformTags: { [actionName: string]: string[] } = {};

export function registerAction(
  type: string,
  platform: IPlatforms | '*',
  runtime: IRuntimeFunc
) {
  if (platform === getPlatform() || platform === '*') {
    actions[type] = runtime;
  }
  else {
    actions[type] = () => async payload => payload
  }

  if (!actionPlatformTags[type]) {
    actionPlatformTags[type] = [];
  }
  actionPlatformTags[type].push(platform);
}


export function hasAction(
  type: string, platform: IPlatforms
): boolean {
  return actionPlatformTags[type] &&
    actionPlatformTags[type].indexOf(platform) >= 0;
}

export async function runAction(
  type: string,
  args: { [key: string]: unknown },
  payload: { [key: string]: unknown },
  variants: { [key: string]: unknown }
): Promise<{ [key: string]: unknown }> {
  if (!actions[type]) {
    throw new Error(
      `Unknown action '${type}' at the platform '${getPlatform()}'.`
    );
  }
  return await actions[type](args)(payload, variants);
};
