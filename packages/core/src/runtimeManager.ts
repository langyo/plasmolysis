import { generate } from 'shortid';

import {
  IRuntimeObject,
  IRuntimeFunc,
  IPlatforms
} from './index';
import {
  getPlatform
} from './contextManager';

let runtimes: {
  [tag: string]: {
    [actionName: string]: IRuntimeObject
  }
} = {};
let actions: {
  [key: string]: IRuntimeFunc
} = {};
let entityRegistrationMap: { [key: string]: string[] } = {};

export function loadRuntime(
  runtime: IRuntimeObject,
  tag: string,
  name: string
): void {
  if (typeof runtime[getPlatform()] !== 'undefined') {
    runtimes[tag][name] = runtime[getPlatform()];
  }
};

export function registerAction(
  type: string,
  platform: IPlatforms | '*',
  runtime: IRuntimeFunc
) {
  if (platform === getPlatform() || platform === '*') {
    actions[type] = runtime;
  }
  else {
    actions[type] = () => async payload => payload
  }
}

export function getRuntimeList(tag: string): string[] {
  if (typeof runtimes[tag] === 'undefined') {
    throw new Error(`Unknown tag '${tag}' at the getPlatform() '${getPlatform()}'.`);
  }
  return Object.keys(runtimes[tag]);
}

export function hasRuntime(
  tag: string, streamName: string
): boolean {
  if (
    typeof runtimes[tag] === 'undefined' ||
    typeof runtimes[tag][streamName] === 'undefined'
  ) {
    return false;
  } else {
    return true;
  }
}

export async function runAction(
  type: string,
  args: { [key: string]: any },
  payload: { [key: string]: any },
  variants: { [key: string]: any }
): Promise<{ [key: string]: any }> {
  if (typeof actions[type] === 'undefined') {
    throw new Error(
      `Unknown action '${type}' at the getPlatform() '${getPlatform()}'.`
    );
  }
  return await actions[type](args)(payload, variants);
};

export async function runRuntime(
  tag: string,
  name: string,
  payload: { [key: string]: any },
  variants: { [key: string]: any }
) {
  const { type, args } = runtimes[tag][name];
  return await runAction(type, args, payload, variants);
}

export function summonEntity(
  contextName: string, id: string = generate()
): string {
  if (typeof entityRegistrationMap[id] === 'undefined') {
    entityRegistrationMap[id] = [contextName];
  } else if (entityRegistrationMap[id].indexOf(contextName) < 0) {
    entityRegistrationMap[id].push(contextName);
  }
  return id;
}

export function killEntity(contextName: string, id: string) {
  if (typeof entityRegistrationMap[id] !== 'undefined') {
    if (entityRegistrationMap[id].indexOf(contextName) >= 0) {
      if (entityRegistrationMap[id].length === 1) {
        delete entityRegistrationMap[id];
      } else {
        entityRegistrationMap[id] =
          entityRegistrationMap[id].filter(n => n !== contextName);
      }
    }
  }
}

export function getEntityStatus(id: string) {
  if (typeof entityRegistrationMap[id] === 'undefined') {
    return [];
  } else {
    return entityRegistrationMap[id];
  }
}
