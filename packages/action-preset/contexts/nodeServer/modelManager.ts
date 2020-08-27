import {
  IProjectPackage,
  IGetContextFuncType,
  IModelManager,
  IWebClientComponentType
} from '../../type';

export function modelManager(
  projectPackage: IProjectPackage,
  getContext: IGetContextFuncType
): IModelManager {
  let components: { [key: string]: IWebClientComponentType } = {};

  function storageModel(
    modelType: string,
    component: IWebClientComponentType
  ): void {
    components[modelType] = component;
  };

  for (const modelType of Object.keys(projectPackage.webClient)) {
    storageModel(modelType, projectPackage.webClient[modelType].component);
  }

  function loadComponent(type: string): IWebClientComponentType {
    return components[type];
  }

  function getModelList(): string[] {
    return Object.keys(components);
  }

  return Object.freeze({
    storageModel,
    loadComponent,
    getModelList
  });
};
