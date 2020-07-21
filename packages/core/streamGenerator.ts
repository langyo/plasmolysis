import {
  Platforms,
  ActionObject,
  ActionBridgeObject,
  PureActionObject
} from './type';

export default function (
  platform: Platforms,
  stream: Array<ActionObject | ActionBridgeObject>
): Array<PureActionObject> {
  let ret: Array<PureActionObject> = [];
  for (const obj of stream)
    switch (obj.disc) {
      case 'ActionObject':
        if (obj.platform === platform) ret.push({
          type: obj.type,
          args: obj.args
        });
        break;
      case 'ActionBridgeObject':
        if (obj.sourcePlatform === platform) ret.push({
          type: obj.sourceActionType,
          args: obj.sourceAction
        });
        break;
    }
  return ret;
};