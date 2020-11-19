import { generate } from 'shortid';

let variantGetters: {
  [key: string]: (entityID: string) => { [key: string]: any }
} = {};

export function registerVariantGetter(
  contextName: string,
  getter: (entityID: string) => { [key: string]: any }
) {
  variantGetters[contextName] = getter;
}

let entityVariants: {
  [entityID: string]: {
    [context: string]: { [key: string]: string | number }
  }
} = {};

export function getVariants(entityID: string) {
  return Object.keys(entityVariants[entityID]).reduce((obj, contextName) => ({
    ...obj,
    ...entityVariants[entityID][contextName]
  }), {});
}

export function summonEntity(
  id: string = generate(),
  sourceContextVariants: {
    [name: string]: {
      [key: string]: any
    }
  } = {}
): string {
  if (typeof entityVariants[id] === 'undefined') {
    entityVariants[id] = sourceContextVariants;
  }
  for (const contextName of Object.keys(variantGetters)) {
    if (typeof entityVariants[id][contextName] === 'undefined') {
      entityVariants[id][contextName] = variantGetters[contextName](id);
    }
  }
  return id;
}

export function killEntity(id: string) {
  delete entityVariants[id];
}

export function getVariantsFromContext(entityId: string, context: string) {
  if (typeof entityVariants[entityId] === 'undefined') {
    throw new Error(`Unknown entity '${entityId}'.`);
  }
  if (typeof entityVariants[entityId][context] === 'undefined') {
    return {};
  }
  return entityVariants[entityId][context];
}

export function setVariantsFromContext(
  entityId: string,
  context: string,
  content: { [key: string]: string | number }
) {
  if (typeof entityVariants[entityId] === 'undefined') {
    throw new Error(`Unknown entity '${entityId}'.`);
  }
  if (typeof entityVariants[entityId][context] === 'undefined') {
    entityVariants[entityId][context] = { ...content };
  } else {
    entityVariants[entityId][context] = {
      ...entityVariants[entityId][context], ...content
    };
  }
}

export function getEntityStorageArchive() {
  return { ...entityVariants };
}
