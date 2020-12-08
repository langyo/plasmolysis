import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from 'nickelcat-action-preset';

export function renderStaticHtml(
  path: string,
  init: (args: IInitArgs) => { [key: string]: any },
  component: (...args: any[]) => string
): IRuntimeObject {
  return {
    type: 'preset.renderStaticString',
    args: { path, init, component }
  }
}
