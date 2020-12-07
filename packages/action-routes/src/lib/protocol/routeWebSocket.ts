import { IRuntimeObject } from 'nickelcat';
import { IInitArgs } from 'nickelcat-action-preset';

export function routeWebSocket(
  port: number | {
    port: number,
    headParser?: (headStr: string, variants: IInitArgs) => string | undefined,
    security?: 'wsOnly' | 'wssOnly' | 'auto'
  }
): IRuntimeObject {
  return {
    type: 'preset.routeWebSocket',
    args: { }
  }
}
