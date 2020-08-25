import {
  IRequestForwardObjectType,
  IRequestForwardFuncType,
  ISessionInfo
} from './type';

import { Script, createContext } from 'vm';

let vm = new Script('');
let caller: (sessionInfo: ISessionInfo) => Promise<IRequestForwardObjectType> =
  async sessionInfo => {
    return {
      status: 'processed',
      code: 500,
      type: 'text/html',
      body: `
<html>
<head>
    <title>RUNTIME ERROR</title>
</head>
<body>
  <h2>Oops!</h2>
  <p>The server isn't ready to provide services.</p>
  </body>
</html>
    `
    }
  };

export function build(code: string) {
  vm = new Script(code);
  vm.runInContext(createContext({
    __CALLBACK: (
      func: (sessionInfo: ISessionInfo) =>
        Promise<IRequestForwardObjectType>) => {
        caller = func;
      }
  }));
};

export const send: IRequestForwardFuncType =
  async (sessionInfo: ISessionInfo) => {
    return await caller(sessionInfo);
  };