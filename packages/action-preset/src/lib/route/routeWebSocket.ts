import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from '../../index';

export function routeWebSocket(
): IRuntimeObject {
  return {
    type: 'preset.routeWebSocket',
    args: { }
  }
}
