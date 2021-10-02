/// <reference path="../../src/type.d.ts" />

import React, { useState } from 'react';

@remote.browser('react')
class ClientEntry {
  @remote.browser.inject('#root')
  public render() {
    const [val, setVal] = useState('click me!');

    return <button onClick={async () => setVal(await Services.test())}>
      {val}
    </button>;
  }
}

@native.http('koa')
class Services {
  @native.http.get('/test')
  public static async test() {
    return 'test';
  }

  @native.http.get('/')
  public clientEntry = ClientEntry;
}
