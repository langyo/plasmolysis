import { linkTo } from '../linkManager';

export async function to(
  path: string,
  task: (...args: any[]) => any
): IRuntimeObject {
  return await linkTo(platform, path, payload);
}

