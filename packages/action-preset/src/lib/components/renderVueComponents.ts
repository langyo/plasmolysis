import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';

export function renderVueComponent(
  func: (...args: any[]) => Vue.Component
) {
  return { type: 'preset.renderVueComponent', func }
}
