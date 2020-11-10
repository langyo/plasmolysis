import { IRuntimeObject } from 'nickelcat';

export function renderEjsComponent(
  func: (...args: any[]) => string
): IRuntimeObject {
  return { type: 'preset.renderEjsComponent', args: { func } }
}
