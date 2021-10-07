/// <reference path="../../src/type.d.ts" />

import React, { useState } from 'react';

@native.browser('react')
class ClientEntry {
  @native.browser.inject('#root')
  async render() {
    const [val, setVal] = useState(
      await native.to.remote.http().run(async () => {
        return 1;
      })
    );

    return (
      <>
        <button
          onClick={async () =>
            setVal(await native.to.remote.http().get('/test'))
          }
        >
          {native.to.remote.http().run(async () => {
            return 'test';
          })}
        </button>
        <button
          onClick={async () =>
            setVal(
              await native.to.remote.http().run(async () => {
                return val + 1;
              })
            )
          }
        >
          {val}
        </button>
      </>
    );
  }
}

@remote.http('koa')
class Services {
  @remote.http.get('/test')
  static async test() {
    return 'test';
  }

  @remote.http.get('/')
  clientEntry = ClientEntry;
}
