import {
  Platforms,
  ActionObject,
  ActionBridgeObject,
  PureActionObject
} from './type';
import streamGenerator from './streamGenerator';

type IStorageSubStreams = {
  [platform in Platforms]?: {
    [key: string]: Array<PureActionObject>;
  };
};

let storageStreams: IStorageSubStreams = {};

export function parse(
  platform: Platforms,
  stream: Array<ActionObject | ActionBridgeObject>
): void {
  for (const obj of stream)
    switch (obj.disc) {
      case 'ActionObject':
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
