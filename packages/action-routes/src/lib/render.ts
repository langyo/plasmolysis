import {
  setGlobalState, setState
} from '../stateManager';

export interface IMethods {
  setGlobalState(key: string, value: unknown): void;
  setState(key: string, value: unknown): void;
}
export const requiredItems = ['render', 'init'];
export const privateMethods = {
  setGlobalState, setState
};

export function constructor(pkg: { [key: string]: unknown }): string {
  // TODO - Returns the variants' generator id.
  return '';
}

export function variantsGenerator(id: string) {

}
