import {
  IPlatforms,
  IOriginalActionObject,
  IActionManager,
  IActionObject
} from './type';

export function streamGenerator(
  platform: IPlatforms,
  stream: IOriginalActionObject[],
  actionManager: IActionManager
): IActionObject[] {
  let ret: IActionObject[] = [];
  let isHead: boolean = true;
  for (const obj of stream) {
    if (typeof obj === 'function') {
      ret.push({
        kind: 'ActionJudgeObject',
        cond: obj
      });
    }
    else if (typeof obj === 'string' && /ˇloop( ([1-9][0-9]*))?$/.test(obj)) {
      if (isHead) {
        ret.push({
          kind: 'ActionLoopTag',
          mode: (obj as string).length > 4 ? 'fixed' : 'unlimited',
          wait: (obj as string).length > 4 ?
            +/ˇloop( ([1-9][0-9]*))?$/.exec(obj)[2] :
            undefined
        });
      }
      else {
        throw new Error('The loop tag must be declared on the head of the stream.');
      }
      break;
    }
    else if (Array.isArray(obj)) {
      ret.push({
        kind: 'ActionSubStream',
        stream: streamGenerator(platform, obj, actionManager)
      });
    }
    else {
      ret = ret.concat(
        actionManager.getTranslator(obj.platform, obj.pkg, obj.type)(obj)
      );
    }
    isHead = false;
  }
  return ret;
};