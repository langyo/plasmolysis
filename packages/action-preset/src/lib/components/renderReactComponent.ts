import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from '../../index';

export function renderReactComponent(
  init: (args: IInitArgs) => { [key: string]: any },
  component: (...args: any[]) => React.Component
): IRuntimeObject {
  return { type: 'preset.renderReactComponent', args: { init, component } }
}
