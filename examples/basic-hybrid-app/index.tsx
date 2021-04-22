import { remote, native } from '../../packages/core/src/index';
import React, { useState } from 'react';

@remote.browser
class ClientEntry {
  @remote.browser.entry('react', '#root')
  public render() {
    const [val, setVal] = useState('click me!');

    return <button onClick={async () => setVal(await Services.test())}>
      {val}
    </button>;
  }
}

@native.hybrid('electron')
class Services {
  @native.hybrid.get('/test')
  public static async test() {
    return 'test';
  }

  @native.hybrid.get('/').bind(ClientEntry)
  public clientEntry;

  @native.hybrid.inject()
  public ctx;
}
