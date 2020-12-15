import { IInitArgs } from 'nickelcat-action-preset';

export function renderVueComponent(
  path: string,
  init: (args: IInitArgs) => { [key: string]: any },
  controllers: { [name: string]: (...args: any[]) => any },
  component: (...args: any[]) => Vue.Component
) {

}

