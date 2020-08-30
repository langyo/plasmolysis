import {
  IRequestForwardObjectType,
  IRequestForwardFuncType,
  ISessionInfo
} from './type';

import { NodeVM } from 'vm2';
import { parse as errorParse } from 'error-stack-parser';
import { SourceMapConsumer } from 'source-map';

import { join } from 'path';

let caller: (sessionInfo: ISessionInfo) => Promise<IRequestForwardObjectType> =
  async () => {
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

let vm = new NodeVM({
  console: 'inherit',
  sandbox: {
    __CALLBACK: (
      func: (sessionInfo: ISessionInfo) => Promise<IRequestForwardObjectType>
    ) => {
      caller = func;
    }
  },
  require: {
    external: true,
    builtin: ['*'],
    root: [
      join(__dirname, './node_modules'),
      join(process.cwd(), './node_modules')
    ]
  }
});

export function build({
  code, sourceMap
}: { code: string, sourceMap: string }) {
  try {
    vm.run(code)('services');
  } catch (e) {
    (async function () {
      const errInfo = errorParse(e);
      const consumer = await new SourceMapConsumer(JSON.parse(sourceMap));

      console.error('Error:', e.message);
      for (let errItem of errInfo) {
        const { line, column, source } = consumer.originalPositionFor({
          line: errItem.lineNumber,
          column: errItem.columnNumber
        });

        if (line && column && source) {
          console.error(`  at ${source} ${line}:${column}`);
        }
      }
    })()
  }
};

export const send: IRequestForwardFuncType =
  async (sessionInfo: ISessionInfo) => {
    return await caller(sessionInfo);
  };