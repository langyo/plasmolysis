/// <reference path="type.d.ts" />

import { Script, createContext } from 'vm';

let vm = new Script('');
let caller: (sessionInfo: SessionInfo) => Promise<RequestForwardObjectType> = async sessionInfo => {
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
    __callback: (func: (sessionInfo: SessionInfo) => Promise<RequestForwardObjectType>) => {
      caller = func;
    }
  });
  vm.runInContext(context);
};

export const send: RequestForwardFuncType = async (sessionInfo: SessionInfo) => {
  return await caller(sessionInfo);
};