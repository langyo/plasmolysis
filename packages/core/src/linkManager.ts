import { IPlatforms } from './index';
import { getPlatform } from './contextManager';
import axios from 'axios';

let targetProtocols: {
  [platform in IPlatforms]?: (
    path: string,
    obj: { [key: string]: unknown }
  ) => Promise<{ [key: string]: unknown }>
} = {
  'js.node': async (path, obj) => await axios.post(`/${path.split('.').join('/')}`, obj)
};

export function getProtocol(platform: IPlatforms): (
  path: string,
  obj: { [key: string]: unknown }
) => Promise<{ [key: string]: unknown }> {
  if (!targetProtocols[platform]) {
    throw new Error(`Unknown protocol: ${platform}.`);
  }
  return targetProtocols[platform];
}

export function setProtocol(
  targetPlatform: IPlatforms,
  func: (
    path: string,
    obj: { [key: string]: unknown }
  ) => Promise<{ [key: string]: unknown }>
) {
  targetProtocols[targetPlatform] = func;
}

switch(getPlatform()) {
  case 'js.browser':
    setProtocol(
      'js.node',
      async (path, obj) => await axios.post(`/${path.split('.').join('/')}`, obj)
    );
    break;
  default:
    break;
}

export async function linkTo(
  platform: IPlatforms,
  path: string,
  payload: { [key: string]: unknown }
): Promise<{ [key: string]: unknown }> {
  if (!targetProtocols[platform]) {
    throw new Error(`Cannot transfer to the platform: ${platform}.`);
  }
  return await targetProtocols[platform](path, payload);
}
