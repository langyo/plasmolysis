import { generate } from 'shortid';
import { createModel } from './utils/globalState';

export default (modelType, payload = {}, id = generate()) =>
  createModel(modelType, payload, id);
