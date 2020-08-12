/// <reference path="../core/type.d.ts" />

import * as actions from './actions';
import * as contexts from './contexts';

export default <PackageInfo> {
  name: 'preset',
  description: 'The core action package.',
  author: 'langyo',
  repository: 'https://github.com/langyo/nickelcat.git',

  actions,
  contexts
};
