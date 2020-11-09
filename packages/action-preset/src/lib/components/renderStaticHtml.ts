import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';

export function renderStaticHtml(
  func: (...args: any[]) => string
) {
  return { type: 'preset.renderStaticString', func }
}
