import { IRuntimeObject } from './index';
import { getPlatform } from './contextManager';
import { runAction } from './actionManager';

let runtimes: { [tag: string]: { [actionName: string]: IRuntimeObject } } = {};

export function loadRuntime(
  runtime: IRuntimeObject,
  tag: string,
  name: string
): void {
  if (typeof runtime[getPlatform()] !== 'undefined') {
    runtimes[tag][name] = runtime[getPlatform()];
  }
};

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

export async function runRuntime(
  tag: string,
  name: string,
  payload: { [key: string]: any },
  variants: { [key: string]: any }
) {
  const { type, args } = runtimes[tag][name];
  return await runAction(type, args, payload, variants);
}
