import pluginTester from 'babel-plugin-tester';
import pluginObject from '../../src/export';

pluginTester({
  plugin: pluginObject,
  tests: [
    {
      code: 'let hello = "hi";',
      output: 'let hello = "hi";',
    },
  ],
});
