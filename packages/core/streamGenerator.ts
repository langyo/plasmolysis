/// <reference path="type.d.ts" />

export default function streamGenerator(
  platform: Platforms,
  stream: Array<OriginalActionObject>,
  actionManager: ActionManager
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
    else if (typeof obj === 'string' && /ˇloop( ([1-9][0-9]*))?$/.test(obj)) {
      if (isHead) ret.push({
        kind: 'ActionLoopTag',
        mode: (obj as string).length > 4 ? 'fixed' : 'unlimited',
        wait: (obj as string).length > 4 ? +/ˇloop( ([1-9][0-9]*))?$/.exec(obj)[2] : null
      });
      else throw new Error('The loop tag must be declared on the head of the stream.');
      break;
    }
    else if (Array.isArray(obj)) {
      ret.push({
        kind: 'ActionSubStream',
        stream: streamGenerator(platform, obj, actionManager)
      });
    }
    else ret = ret.concat(actionManager.getTranslator(obj.platform, obj.pkg, obj.type)(obj));
    isHead = false;
  }
  return ret;
};