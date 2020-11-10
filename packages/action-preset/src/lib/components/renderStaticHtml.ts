import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from '../../index';

export function renderStaticHtml(
  init: (args: IInitArgs) => { [key: string]: any },
  component: (...args: any[]) => string
): IRuntimeObject {
  return { type: 'preset.renderStaticString', args: { init, component } }
}
