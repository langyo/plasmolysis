import {
  IWebClientComponentType
} from '../../core';

let components: { [key: string]: IWebClientComponentType } = {};

export function storageComponent(
  modelType: string,
  component: IWebClientComponentType
): void {
  components[modelType] = component;
};

export function getModelList(): string[] {
  return Object.keys(components);
}

export function createComponent(
  type: string, initState: { [key: string]: any }
): string {

}