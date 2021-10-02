/// <reference path="../../src/type.d.ts" />

import React, { useState } from 'react';

@native.browser('react')
class ClientEntry {
  @native.browser.inject('#root')
  public render() {
    const [val, setVal] = useState('click me!');

    return (
      <>
        <button
          onClick={async () =>
            setVal(await native.to.remote.http().get('/test'))
          }
        >
          {val}
        </button>
        <button
          onClick={async () =>
            setVal(
              await native.to.remote.http().run(async () => {
                return 'test2';
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
  public static async test() {
    return 'test';
  }

  @remote.http.get('/')
  public clientEntry = ClientEntry;
}
