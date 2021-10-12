/// <reference path="../../src/type.d.ts" />

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

$$.remote.http(
  'koa',
  {
    id: 'web',
  },
  {
    async test() {
      return 'response from the web';
    },
  }
);

$$.remote.http(
  'koa',
  {
    id: 'backend',
    port: 9233,
  },
  {
    async test() {
      return 'response from the backend';
    },
  }
);
