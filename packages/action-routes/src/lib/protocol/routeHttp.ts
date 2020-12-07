import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from 'nickelcat-action-preset';

export function routeHttp(
): IRuntimeObject {
  return {
    type: 'preset.routeHttp',
    args: { }
  }
}
