import { storageModel } from '../lib/modelManager';
import { generate } from 'shortid';

export default (component, controllers, modelType = generate()) =>
  storageModel({ component, controllers, modelType });
