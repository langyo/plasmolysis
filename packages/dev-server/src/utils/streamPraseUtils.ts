import {
  IRuntimeObject,
  IPlatforms
} from 'nickelcat';

interface IRuntimeObjectWithRoute {
  type: string, args: { [key: string]: any }, route: string
}

export function filterSpecialAction(stream: IRuntimeObject, type: string) {
  let ret: IRuntimeObjectWithRoute[] = [];
  const dfs = (obj: IRuntimeObject, route: string = ''): IRuntimeObject => {
    if (typeof obj === 'undefined') { return; }
    switch (obj.type) {
      case '*.series':
      case '*.parallel':
        obj.args.tasks.forEach(
          (obj: IRuntimeObject, index: number) => dfs(obj, `${route}[${index}]`)
        );
        return;
      case '*.loop':
      case '*.test':
        dfs(obj.args.task, `${route}.test`);
        return;
      case '*.trap':
        dfs(obj.args.task, `${route}.test`);
        dfs(obj.args.errTask, `${route}.crash`);
        return;
      case type:
        ret.push({ ...obj, route });
        return;
    }
  };
  dfs(stream);
  return ret;
}

import { hasAction } from 'nickelcat/actionManager'

export function filterSpecialPlatform(stream: IRuntimeObject, platform: IPlatforms) {
  const dfs = (obj: IRuntimeObject, route: string = ''): IRuntimeObject => {
    if (typeof obj === 'undefined') { return; }
    switch (obj.type) {
      case '*.series':
      case '*.parallel':
        obj.args.tasks = obj.args.tasks.map(
          (obj: IRuntimeObject, index: number) => dfs(obj, `${route}[${index}]`)
        );
        return;
      case '*.loop':
      case '*.test':
        obj.args.task = dfs(obj.args.task, `${route}.test`);
        return;
      case '*.trap':
        obj.args.task = dfs(obj.args.task, `${route}.test`);
        obj.args.errTask = dfs(obj.args.errTask, `${route}.crash`);
        return;
      default:
        if (hasAction(obj.type, platform)) {
          return obj;
        } else {
          return undefined;
        }
    }
  };
  return dfs(stream);
}
