import { IRuntimeFunc } from './index';
import { getPlatform } from './contextManager';
import { runAction } from './actionManager';

let runtimes: { [tag: string]: { [actionName: string]: IRuntimeFunc } } = {};

export function loadRuntime(
  runtime: IRuntimeFunc,
  tag: string,
  name: string
): void {
  runtimes[tag][name] = runtime;
};

export function getRuntimeList(tag: string): string[] {
  if (!runtimes[tag]) {
    throw new Error(`Unknown tag '${tag}' at the getPlatform() '${getPlatform()}'.`);
  }
  return Object.keys(runtimes[tag]);
}

export function hasRuntime(
  tag: string, streamName: string
): boolean {
  if (
    !runtimes[tag] ||
    !runtimes[tag][streamName]
  ) {
    return false;
  } else {
    return true;
  }
}

type IVariantsGenerator =
  (id: string) => string | number | { [key: string]: unknown };

let variantsGenerators: { [tag: string]: IVariantsGenerator } = {};

export function registerVariantsGenerator(
  tag: string, generator: IVariantsGenerator
) {
  variantsGenerators[tag] = generator;
}

export function generateVariants(id: string) {
  return Object.keys(variantsGenerators).reduce(
    (obj, tag) => ({ ...obj, [tag]: variantsGenerators[tag](id) }), { id }
  );
}

export async function runRuntime(
  tag: string,
  name: string,
  id: string,
  payload: { [key: string]: unknown }
) {
  const { type, args } = runtimes[tag][name];
  return await runAction(type, args, payload, generateVariants(id));
}
