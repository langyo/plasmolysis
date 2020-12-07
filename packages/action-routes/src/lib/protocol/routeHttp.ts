import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from 'nickelcat-action-preset';

export function routeHttp(
  entry: string | {
    host?: string,
    port?: string,
    path: string,
    security?: 'httpOnly' | 'httpsOnly' | 'auto'
  },
  action: IRuntimeObject
): IRuntimeObject {
  return {
    type: 'preset.routeHttp',
    args: { }
  }
}
