import { IRuntimeObject } from 'nickelcat';
import { Writable } from 'stream';
import {
  exprVerify,
  splitThroughRegex,
  vmLoader
} from './utils';

export let routeTasks: {
  [id: number]: {
    match: ({ path: string, query: { [key: string]: string } }),
    call: (stream: Writable) => Promise<void>
  }
} = {};

export async function installRoute(
  route: IRuntimeObject,
  controllers: { [key: string]: IRuntimeObject },
  filePath: string,
  options: {
    routePath: string
  }
) {
  switch(route.type) {
    case 'preset.routeHttp':
    case 'preset.routeFtp':
    case 'preset.routeWebSocket':
    // case 'preset.routeSmtp':
    // case 'preset.routeStaticFile':
    default:
  }
}

export async function uninstallRoute() {
}
