import {
  IProjectPackage,
  IGetContextFuncType,
  IActionManager,
  IStreamManager,
  IPlatforms,
  IActionObject,
  IOriginalActionObject
} from './type';

import { streamRuntime } from './streamRuntime';
import { streamGenerator } from './streamGenerator';

export function streamManager(
  projectPackage: IProjectPackage,
  getContext: IGetContextFuncType
): IStreamManager {
  let streams: {
    [platform in IPlatforms]: {
      [tag: string]: {
        [actionName: string]: IActionObject[]
      }
    }
  } = {
    webClient: {},
    nodeServer: {},
    electronClient: {},
    cordovaClient: {},
    flutterClient: {}
  };

  function loadStream(
    stream: IOriginalActionObject[],
    platform: IPlatforms,
    tag: string,
    streamName: string
  ): void {
    streams[platform][tag][streamName] = streamGenerator(
      platform, stream, getContext('actionManager') as IActionManager
    );
  };

  function loadPackage(projectPackage: IProjectPackage): void {
    for (const platform of Object.keys(projectPackage.data)) {
      for (const tag of Object.keys(projectPackage.data[platform])) {
        if (typeof projectPackage.data[platform][tag].controller === 'object') {
          for (const streamName of
            Object.keys(projectPackage.data[platform][tag].controller)
          ) {
            if (platform === 'webClient' && streamName === 'init') {
              loadStream([{
                platform: 'webClient',
                pkg: 'preset',
                type: 'deal',
                args: {
                  func: projectPackage.data[platform][tag].controller.init
                }
              }], 'webClient', tag, 'init');
            } else if (platform === 'webClient' && streamName === 'preload') {
              loadStream([{
                platform: 'nodeServer',
                pkg: 'preset',
                type: 'deal',
                args: {
                  func: projectPackage.data[platform][tag].controller.preload
                }
              }], 'nodeServer', tag, 'preload');
            } else {
              loadStream(
                projectPackage.data[platform][tag].controller[streamName],
                platform as IPlatforms, tag, streamName
              );
            }
          }
        }
      }
    }
  }

  loadPackage(projectPackage);

  function getStreamList(platform: IPlatforms, tag: string): string[] {
    if (typeof streams[platform][tag] === 'undefined') {
      throw new Error(`Unknown tag '${tag}' at the platform '${platform}'.`);
    }
    return Object.keys(streams[platform][tag]);
  }

  function hasStream(
    platform: IPlatforms, tag: string, streamName: string
  ): boolean {
    if (
      typeof streams[platform][tag] === 'undefined' ||
      typeof streams[platform][tag][streamName] === 'undefined'
    ) {
      return false;
    } else {
      return true;
    }
  }

  function runStream(
    platform: IPlatforms,
    tag: string,
    streamName: string,
    payload: { [key: string]: any },
    localContext: { [key: string]: any }
  ): { [key: string]: any } {
    if (
      typeof streams[platform][tag] === 'undefined' ||
      typeof streams[platform][tag][streamName] === 'undefined'
    ) {
      throw new Error(
        `Unknown stream '${streamName}' from '${tag}' at the platform '${platform}'.`
      );
    }
    return streamRuntime(platform, getContext)(
      streams[platform][tag][streamName],
      `[${platform}]${streamName}${
      typeof localContext.modelID !== 'undefined'
      }`,
      localContext
    )(payload);
  };

  return Object.freeze({
    loadStream,
    loadPackage,
    getStreamList,
    hasStream,
    runStream
  });
};