import { generate } from 'shortid';

let entityRegistrationMap: { [entity: string]: string[] } = {};
let entityStorage: {
  [entity: string]: { [context: string]: { [key: string]: string | number } }
} = {};

export function summonEntity(
  contextName: string, id: string = generate(),
  sourceContextConfig?: {
    name: string,
    variants: {
      [key: string]: any
    }
  }
): string {
  if (typeof entityRegistrationMap[id] === 'undefined') {
    entityRegistrationMap[id] = [contextName];
  } else if (entityRegistrationMap[id].indexOf(contextName) < 0) {
    entityRegistrationMap[id].push(contextName);
  }
  return id;
}

export function killEntity(contextName: string, id: string) {
  if (typeof entityRegistrationMap[id] !== 'undefined') {
    if (entityRegistrationMap[id].indexOf(contextName) >= 0) {
      if (entityRegistrationMap[id].length === 1) {
        delete entityRegistrationMap[id];
      } else {
        entityRegistrationMap[id] =
          entityRegistrationMap[id].filter(n => n !== contextName);
      }
    }
  }
}

export function getEntityDependencyStatus(entityId: string) {
  if (typeof entityRegistrationMap[entityId] === 'undefined') {
    return [];
  } else {
    return entityRegistrationMap[entityId];
  }
}

export function getEntityStorage(entityId: string, context: string) {
  if (typeof entityStorage[entityId] === 'undefined') {
    throw new Error(`Unknown entity '${entityId}'.`);
  }
  if (typeof entityStorage[entityId][context] === 'undefined') {
    return {};
  }
  return entityStorage[entityId][context];
}

export function setEntityStorage(entityId: string, context: string, content: {
  [key: string]: string | number
}) {
  if (typeof entityStorage[entityId] === 'undefined') {
    throw new Error(`Unknown entity '${entityId}'.`);
  }
  if (typeof entityStorage[entityId][context] === 'undefined') {
    entityStorage[entityId][context] = { ...content };
  } else {
    entityStorage[entityId][context] = {
      ...entityStorage[entityId][context], ...content
    };
  }
}

export function getEntityStorageArchive() {
  return { ...entityStorage };
}
