import pluginTester from 'babel-plugin-tester';
import pluginObject from '../src/export';

pluginTester({
  plugin: pluginObject,
  babelOptions: {
    filename: 'test.ts',
    presets: ['@babel/preset-react', '@babel/preset-typescript'],
  },
  pluginOptions: {
    target: 'server-http',
  },
  tests: [
    {
      code: `
import React, { useState } from 'react';

$$.native.browser(
  'react',
  {
    rootElement: '#root',
    defaultRemote: 'web',
  },
  {
    async render() {
      const [val, setVal] = useState(
        await $$.native.to.remote.http().run(async () => 1)
      );

      return (
        <>
          <button
            onClick={async () =>
              setVal(await $$.native.to.remote.http('backend').get('/test'))
            }
          >
            {$$.native.to.remote.http.run(async () => 'test')}
          </button>
          <button
            onClick={async () =>
              setVal(await $$.native.to.remote.http.run(async () => val + 1))
            }
          >
            {val}
          </button>
        </>
      );
    },
  }
);
`,
      output: `
$$.remote.http(
  'koa',
  {
    id: 'web',
  },
  {
    run_1: async () => val + 1,
  }
);
`,
    },
  ],
});
