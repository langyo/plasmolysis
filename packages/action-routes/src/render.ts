export interface IMethods {
  setGlobalState(obj: { [key: string]: unknown }): void;
  setState(obj: { [key: string]: unknown }): void;
}

export const requiredItems = ['render', 'init'];
export const privateMethods = {

};

export function constructor(
  pkg: { [key: string]: unknown },
  variants: { [key: string]: unknown }
): string {
  // TODO - Returns the variants' generator id.
  return '';
}

export function variantsGenerator(id: string) {

}
