import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from 'nickelcat-action-preset';

export function renderReactComponent(
  path: string,
  init: (args: IInitArgs) => { [key: string]: any },
  controllers: { [name: string]: IRuntimeObject },
  component: (...args: any[]) => React.Component
): IRuntimeObject {
  return {
    type: 'preset.renderReactComponent',
    args: { path, init, controllers, component }
  }
}
