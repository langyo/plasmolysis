import {
  IPackageInfo
} from './type';

import * as actions from './actions';
import * as contexts from './contexts';

export const packageInfo = {
  name: 'preset',
  description: 'The core action package.',
  author: 'langyo',
  repository: 'https://github.com/langyo/nickelcat.git',

  actions,
  contexts
} as IPackageInfo;
