import { IInitArgs } from 'nickelcat-action-preset';

export function renderEjsComponent(
  path: string,
  init: (args: IInitArgs) => { [key: string]: any },
  component: (...args: any[]) => string
) {

}

