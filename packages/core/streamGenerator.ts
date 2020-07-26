import {
  Platforms,
  ActionObject
} from './type';

export default function streamGenerator(
  platform: Platforms,
  stream: Array<ActionObject>
): Array<ActionObject> {
  let ret: Array<ActionObject> = [];
  let isHead: boolean = true;
  for (const obj of stream) {
    if (typeof obj === 'function') {
      ret.push({
        kind: 'ActionJudgeObject',
        cond: obj
      });
    }
    else if (Array.isArray(obj)) {
      ret.push({
        kind: 'ActionSubStream',
        stream: streamGenerator(platform, obj)
      });
    }
    else switch (obj.kind) {
      case 'ActionNormalObject':
        if (obj.platform === platform)  ret.push({
          kind: 'ActionNormalObject',
          type: obj.type,
          args: obj.args,
          catch: obj.catch && streamGenerator(obj.platform, obj.catch) || null
        });
        break;
      case 'ActionBridgeObject':
        if (obj.sourcePlatform === platform) ret.push({
          kind: 'ActionNormalObject',
          type: obj.sourceActionType,
          args: obj.sourceAction,
          catch: obj.sourceActionCatch && streamGenerator(obj.sourcePlatform, obj.sourceActionCatch) || null
        });
        break;
      case 'ActionLoopTag':
        if (isHead) ret.push({
          kind: 'ActionLoopTag',
          mode: obj.mode,
          wait: obj.wait || null
        });
        else throw new Error('The loop tag must be declared on the head of the stream.');
        break;
      case 'ActionJudgeObject':
        // The origin stream don't have this kind of the objects.
        throw new Error('Can\'t support the action object.');
    }
    isHead = false;
  }
  return ret;
};