import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from '../../index';

export function renderEjsComponent(
  init: (args: IInitArgs) => { [key: string]: any },
  component: (...args: any[]) => string
): IRuntimeObject {
  return { type: 'preset.renderEjsComponent', args: { init, component } }
}
