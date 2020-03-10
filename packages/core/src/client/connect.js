import { storageModel } from './utils/modelStore';
import { generate } from 'shortid';

export default (component, controllers, modelType = generate()) =>
  storageModel({ component, controllers, modelType });
