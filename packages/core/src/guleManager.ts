import {
  IProjectPackage,
  IGlueManager,
  IContextManager,
  IPlatforms,
} from './index';
import axios from 'axios';

export function glueManagerFactory(
  projectPackage: IProjectPackage,
  contextManager: IContextManager,
  platform: IPlatforms
): IGlueManager {
  let protocols: {
    [platform in IPlatforms]?: (
      path: string,
      obj: { [key: string]: any }
    ) => Promise<{ [key: string]: any }>
  } = {
    'js.node': async (path, obj) => await axios.post(`/${path.split('.').join('/')}`, obj)
  };

  function getProtocol(platform: IPlatforms): (
    path: string,
    obj: { [key: string]: any }
  ) => Promise<{ [key: string]: any }> {
    if (typeof protocols[platform] === 'undefined') {
      throw new Error(`Unknown protocol: ${platform}.`);
    }
    return protocols[platform];
  }

  function setProtocol(
    platform: IPlatforms,
    func: (
      path: string,
      obj: { [key: string]: any }
    ) => Promise<{ [key: string]: any }>
  ) {
    protocols[platform] = func;
  }

  function linkTo(
    platform: IPlatforms,
    path: string,
    payload: { [key: string]: any }
  ): Promise<{ [key: string]: any }> {
    if (typeof protocols[platform] === 'undefined') {
      throw new Error(`Unknown protocol: ${platform}.`);
    }
    return protocols[platform](path, payload);
  }

  return Object.freeze({
    setProtocol,
    getProtocol,
    linkTo
  });
}