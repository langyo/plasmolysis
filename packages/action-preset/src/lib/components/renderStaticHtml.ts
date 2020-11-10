import { IRuntimeObject } from 'nickelcat';

export function renderStaticHtml(
  func: (...args: any[]) => string
): IRuntimeObject {
  return { type: 'preset.renderStaticString', args: { func } }
}
