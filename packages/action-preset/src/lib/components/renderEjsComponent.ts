import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';

export function renderEjsComponent(
  func: (...args: any[]) => string
) {
  return { type: 'preset.renderEjsComponent', func }
}
