import { IRuntimeObject } from 'nickelcat';
import { registerAction } from 'nickelcat/runtimeManager';

export function renderReactComponent(
  func: (...args: any[]) => React.Component
) {
  return { type: 'preset.renderReactComponent', func }
}
