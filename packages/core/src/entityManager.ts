import { generate } from 'shortid';

let variantGetters: {
  [key: string]: (entityID: string) => { [key: string]: any }
} = {};
let variantInitializer: {
  [key: string]: (entityID: string, onlyMemoried?: boolean) => void
} = {};
let variantDestructor: {
  [key: string]: (entityID: string, onlyMemoried?: boolean) => void
} = {};
let entitys: string[] = [];

export function registerVariantGetter(
  contextName: string,
  getter: (entityID: string) => { [key: string]: any },
  initializer: (entityID: string) => void,
  destructor: (entityID: string) => void,
  dependentContexts: string[] = []
) {
  variantGetters[contextName] = getter;

  let initializerArgs: string[] = [];
  variantInitializer[contextName] = (
    entityID: string, onlyMemoried: boolean = false
  ) => {
    if (initializerArgs.indexOf(entityID) < 0) {
      initializerArgs.push(entityID);
      for (const dep of dependentContexts) {
        if (typeof variantInitializer[dep] === 'undefined') {
          throw new Error(`Need the dependent context '${dep}'.`);
        }
        variantInitializer[dep](entityID);
      }
      if (!onlyMemoried) {
        initializer(entityID);
      }
    }
  };

  let destructorArgs: string[] = [];
  variantDestructor[contextName] = (
    entityID: string, onlyMemoried: boolean = false
  ) => {
    if (destructorArgs.indexOf(entityID) < 0) {
      destructorArgs.push(entityID);
      if (!onlyMemoried) {
        destructor(entityID);
      }
      for (const dep of dependentContexts.reverse()) {
        if (typeof variantDestructor[dep] === 'undefined') {
          throw new Error(`Need the dependent context '${dep}'.`);
        }
        variantDestructor[dep](entityID);
      }
    }
  };
}

export function getVariants(entityID: string) {
  return Object.keys(variantGetters).reduce((obj, name) => ({
    ...obj,
    ...variantGetters[name](entityID)
  }), {});
}

export function summonEntity(
  id: string = generate(),
  sourceContext?: string
): string {
  for (const context of Object.keys(variantInitializer)) {
    if (context === sourceContext) {
      variantInitializer[context](id, true);
    } else {
      variantInitializer[context](id);
    }
  }
  return id;
}

export function killEntity(
  id: string = generate(),
  sourceContext?: string
) {
  for (const context of Object.keys(variantDestructor)) {
    if (context === sourceContext) {
      variantDestructor[context](id, true);
    } else {
      variantDestructor[context](id);
    }
  }
  delete entitys[id];
}
