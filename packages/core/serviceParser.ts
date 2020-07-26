import {
  Platforms,
  ActionObject
} from './type';
import streamGenerator from './streamGenerator';

type IStorageSubStreams = {
  [platform in Platforms]?: {
    [key: string]: Array<ActionObject>;
  };
};

let storageStreams: IStorageSubStreams = {};

export function parse(
  platform: Platforms,
  stream: Array<ActionObject>
): void {
  for (const obj of stream)
    switch (obj.kind) {
      case 'ActionNormalObject':
      case 'ActionJudgeObject':
        break;
      case 'ActionBridgeObject':
        if (obj.targetPlatform !== platform) break;
        if (typeof storageStreams[obj.targetPlatform] === 'undefined')
          storageStreams[obj.targetPlatform] = {};
        storageStreams[obj.targetPlatform][obj.targetStreamKey] = streamGenerator(
          obj.targetPlatform,
          obj.targetStream
        );
        break;
    }
};
