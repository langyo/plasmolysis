import { installComponent } from './frontendLoader';
import { installRoute } from './backendLoader';

export function registerHook(
  type: 'afterTraverse' | 'beforeRunning'
) {}

export function loadSourceCode(
  routePath: string,
  code: string
) {}

