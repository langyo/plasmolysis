import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from '../../index';

export function renderVueComponent(
  init: (args: IInitArgs) => { [key: string]: any },
  component: (...args: any[]) => Vue.Component
): IRuntimeObject {
  return { type: 'preset.renderVueComponent', args: { init, component } }
}
