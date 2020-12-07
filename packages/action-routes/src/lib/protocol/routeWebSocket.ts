import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from 'nickelcat-action-preset';

export function routeWebSocket(
): IRuntimeObject {
  return {
    type: 'preset.routeWebSocket',
    args: { }
  }
}
