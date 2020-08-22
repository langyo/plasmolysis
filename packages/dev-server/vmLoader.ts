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

export function build(code: string, context?: { [key: string]: any }) {
  vm = new Script(code);
  createContext({
    ...context,
    __CALLBACK:
      (func: (sessionInfo: ISessionInfo) =>
        Promise<IRequestForwardObjectType>) => {
        caller = func;
      }
  });
  vm.runInContext(context);
};

export const send: IRequestForwardFuncType =
  async (sessionInfo: ISessionInfo) => {
    return await caller(sessionInfo);
  };