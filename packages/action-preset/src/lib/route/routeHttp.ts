import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from '../../index';

export function routeHttp(
): IRuntimeObject {
  return {
    type: 'preset.routeHttp',
    args: { }
  }
}
