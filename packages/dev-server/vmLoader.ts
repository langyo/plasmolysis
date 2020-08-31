import {
  IRequestForwardObjectType,
  IRequestForwardFuncType,
  ISessionInfo
} from './type';

import { Script, createContext } from 'vm';
import { parse as errorParse } from 'error-stack-parser';
import { SourceMapConsumer } from 'source-map';

let caller: IRequestForwardFuncType = async () => ({
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
</html>`
});

const context = createContext({
  global,
  process,
  require,
  console,
  __CALLBACK: (func: IRequestForwardFuncType) => caller = func
});

export function build({
  code, sourceMap
}: { code: string, sourceMap: string }) {
  try {
    caller = (new Script(code)).runInContext(context);
  } catch (e) {
    (async function () {
      const errInfo = errorParse(e);
      const consumer = await new SourceMapConsumer(JSON.parse(sourceMap));

      console.error('Here are some error stack info before launch the server:');
      for (let errItem of errInfo) {
        const { line, column, source } = consumer.originalPositionFor({
          line: errItem.lineNumber,
          column: errItem.columnNumber
        });

        if (line && column && source) {
          console.error(`    at ${source}:${line}:${column}`);
        }
      }
      console.error('');
      throw e;
    })()
  }
};

export const send: IRequestForwardFuncType =
  async (sessionInfo: ISessionInfo) => {
    return await caller(sessionInfo);
  };