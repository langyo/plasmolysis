import { IRuntimeObject } from 'nickelcat';

export function renderReactComponent(
  func: (...args: any[]) => React.Component
): IRuntimeObject {
  return { type: 'preset.renderReactComponent', args: { func } }
}
