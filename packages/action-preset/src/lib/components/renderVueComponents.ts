import { IRuntimeObject } from 'nickelcat';

export function renderVueComponent(
  func: (...args: any[]) => Vue.Component
): IRuntimeObject {
  return { type: 'preset.renderVueComponent', args: { func } }
}
