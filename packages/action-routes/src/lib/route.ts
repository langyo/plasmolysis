export interface IMethods {
  pushHead(key: string, value: string): void;
  pushContext(value: string): void;
};

export const requiredItems = ['match', 'route'];
export const privateMethods = {
  pushHead: variants => (key: string, value: string) => { return; },
  pushContext: variants => (value: string) => { return; }
}

export function constructor(pkg: { [key: string]: unknown }): string {
  // TODO - Returns the variants' generator id.
  return '';
}

export function variantsGenerator(id: string) {
  
}
