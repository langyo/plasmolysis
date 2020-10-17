import {
  IWebClientComponentType
} from '../../core';

let components: { [key: string]: IWebClientComponentType } = {};

export function storageModel(
  modelType: string,
  component: IWebClientComponentType
): void {
  components[modelType] = component;
};

export function loadComponent(type: string): IWebClientComponentType {
  return components[type];
}

export function getModelList(): string[] {
  return Object.keys(components);
}
