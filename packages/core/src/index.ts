/// <reference types="react" />
/// <reference types="vue" />

export type IWebClientComponentType =
  (props: {
    state: { [key: string]: unknown },
    trigger: { [key: string]: (payload: { [key: string]: any }) => void }
  }) => string | React.Component | Vue.Component;

export type IRuntimeFunc = (args: { [key: string]: any }) => (
  payload: { [key: string]: any },
  variants: Readonly<{ [key: string]: any }>
) => Promise<{ [key: string]: any }>;

import './contextManager';
import './actionManager';
import './runtimeManager';
import './linkManager';

export { to } from './lib/to';
export { on } from './lib/on';

import 'nickelcat-action-preset';
import 'nickelcat-action-routes';

