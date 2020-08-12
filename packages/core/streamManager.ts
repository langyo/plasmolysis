/// <reference path="./type.d.ts" />

import streamRuntime from './streamRuntime';
import streamGenerator from './streamGenerator';

export default function (
  projectPackage: ProjectPackage,
  getContext: GetContextFuncType
): StreamManager {
  let streams: {
    [platform in Platforms]: {
      [tag: string]: {
        [actionName: string]: Array<ActionObject>
      }
    }
  } = {
    webClient: {},
    nodeServer: {},
    electronClient: {},
    cordovaClient: {},
    flutterClient: {}
  };

  function loadStream(stream: Array<OriginalActionObject>, platform: Platforms, tag: string, streamName: string): void {
    streams[platform][tag][streamName] = streamGenerator(platform, stream, getContext('actionManager') as ActionManager);
  };

  for (const platform of Object.keys(projectPackage)) {
    for (const tag of Object.keys(projectPackage[platform])) {
      if (Array.isArray(projectPackage[platform][tag].controller))
        for (const streamName of Object.keys(projectPackage[platform][tag].controller)) {
          loadStream(projectPackage[platform][tag].controller[streamName], platform as Platforms, tag, streamName);
        }
    }
  }

  function runStream(
    platform: Platforms,
    tag: string,
    streamName: string,
    payload: { [key: string]: any },
    localContext: { [key: string]: any }
  ): { [key: string]: any } {
    if (typeof streams[platform][streamName] === 'undefined')
      throw new Error(`Unknown stream '${streamName}' at the platform '${platform}'`);
    return streamRuntime(platform, getContext)(
      streams[platform][tag][streamName],
      `[${platform}]${streamName}${typeof localContext.modelID !== 'undefined'}`,
      localContext
    )(payload);
  };

  return Object.freeze({
    loadStream,
    runStream
  });
};