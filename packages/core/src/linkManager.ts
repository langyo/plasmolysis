import { IPlatforms } from './index';
import axios from 'axios';

let protocols: {
  [platform in IPlatforms]?: (
    path: string,
    obj: { [key: string]: any }
  ) => Promise<{ [key: string]: any }>
} = {
  // TODO - From what to what?
  'js.node': async (path, obj) => await axios.post(`/${path.split('.').join('/')}`, obj)
};

export function getProtocol(platform: IPlatforms): (
  path: string,
  obj: { [key: string]: any }
) => Promise<{ [key: string]: any }> {
  if (typeof protocols[platform] === 'undefined') {
    throw new Error(`Unknown protocol: ${platform}.`);
  }
  return protocols[platform];
}

export function setProtocol(
  platform: IPlatforms,
  func: (
    path: string,
    obj: { [key: string]: any }
  ) => Promise<{ [key: string]: any }>
) {
  protocols[platform] = func;
}

export function linkTo(
  platform: IPlatforms,
  path: string,
  payload: { [key: string]: any }
): Promise<{ [key: string]: any }> {
  if (typeof protocols[platform] === 'undefined') {
    throw new Error(`Unknown protocol: ${platform}.`);
  }
  return protocols[platform](path, payload);
}
