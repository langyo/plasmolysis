import { IPlatforms } from './index';
import { getPlatform } from './contextManager';
import axios from 'axios';

let targetProtocols: {
  [platform in IPlatforms]?: (
    path: string,
    obj: { [key: string]: any }
  ) => Promise<{ [key: string]: any }>
} = {
  'js.node': async (path, obj) => await axios.post(`/${path.split('.').join('/')}`, obj)
};

export function getProtocol(platform: IPlatforms): (
  path: string,
  obj: { [key: string]: any }
) => Promise<{ [key: string]: any }> {
  if (typeof targetProtocols[platform] === 'undefined') {
    throw new Error(`Unknown protocol: ${platform}.`);
  }
  return targetProtocols[platform];
}

export function setProtocol(
  targetPlatform: IPlatforms,
  func: (
    path: string,
    obj: { [key: string]: any }
  ) => Promise<{ [key: string]: any }>
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
  payload: { [key: string]: any }
): Promise<{ [key: string]: any }> {
  if (typeof targetProtocols[platform] === 'undefined') {
    throw new Error(`Cannot transfer to the platform: ${platform}.`);
  }
  return await targetProtocols[platform](path, payload);
}
