import { PackageInfo } from '../core/type';

export default <PackageInfo> {
  name: 'preset',
  description: 'The core action package.',
  author: 'langyo',
  repository: 'https://github.com/langyo/nickelcat.git',

  actions: {
    'webClient': {},
    'nodeServer': {}
  }
};
