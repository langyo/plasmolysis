import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from 'nickelcat-action-preset';

export function renderVueComponent(
  path: string,
  init: (args: IInitArgs) => { [key: string]: any },
  controllers: { [name: string]: IRuntimeObject },
  component: (...args: any[]) => Vue.Component
): IRuntimeObject {
  return {
    type: 'preset.renderVueComponent',
    args: { path, init, controllers, component }
  }
}
