import {
  createModel as wrappedCreateModel
} from '../../stateManager';
import { generate } from 'shortid';

export function createModel(
  type: string,
  initState: { [key: string]: any } = {},
  name: string = generate()
): string {
  wrappedCreateModel(type, initState, name);
  return name;
};

