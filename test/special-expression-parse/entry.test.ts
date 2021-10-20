import pluginTester from 'babel-plugin-tester';
import pluginObject from '../../src/export';

pluginTester({
  plugin: pluginObject,
  babelOptions: {
    filename: 'test.ts',
    presets: [
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
  },
  tests: [
    {
      code: 'let hello = "hi";',
      output: 'let hello = "hi";',
    },
  ],
});
