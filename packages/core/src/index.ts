/// <reference types="react" />
/// <reference types="vue" />

export type IWebClientComponentType =
  (props: {
    state: { [key: string]: unknown },
    trigger: { [key: string]: (payload: { [key: string]: unknown }) => void }
  }) => string | React.Component | Vue.Component;

export type IRuntimeFunc = (args: { [key: string]: unknown }) => (
  payload: { [key: string]: unknown },
  variants: Readonly<{ [key: string]: unknown }>
) => Promise<{ [key: string]: unknown }>;

import './contextManager';
import './actionManager';
import './runtimeManager';
import './linkManager';

import 'nickelcat-action-preset';

