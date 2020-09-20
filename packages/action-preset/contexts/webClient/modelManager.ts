import {
  IProjectPackage,
  Readonly<{ [key: string]: (...args: any[]) => any }>,
  IModelManager,
  IWebClientComponentType
} from '../../type';

export function modelManager(
  projectPackage: IProjectPackage,
  contexts: Readonly<{ [key: string]: (...args: any[]) => any }>
): IModelManager {
  let components: { [key: string]: IWebClientComponentType } = {};

  function storageModel(
    modelType: string,
    component: IWebClientComponentType
  ): void {
    components[modelType] = component;
  };

  function loadPackage(projectPackage: IProjectPackage): void {
    for (const modelType of Object.keys(projectPackage.data.webClient)) {
      storageModel(
        modelType, projectPackage.data.webClient[modelType].component
      );
    }
  }

  loadPackage(projectPackage);

  function loadComponent(type: string): IWebClientComponentType {
    return components[type];
  }

  function getModelList(): string[] {
    return Object.keys(components);
  }

  return Object.freeze({
    storageModel,
    loadPackage,
    loadComponent,
    getModelList
  });
};
