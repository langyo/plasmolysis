import { Script, createContext } from 'vm';
import { parse as errorParse } from 'error-stack-parser';
import { SourceMapConsumer } from 'source-map';
import { log } from 'nickelcat/logManager';

export function vmLoader(
  { code, sourceMap }: { code: string, sourceMap: string },
  path: string,
  caller: (...args: unknown[]) => Promise<unknown>
) {
  const context = createContext({
    global,
    process,
    require,
    console,
    __CALLBACK: (func: (...args: unknown[]) => Promise<unknown>) => caller = func
  });

  try {
    (new Script(code)).runInContext(context);
    log('info', 'VM has loaded', path);
  } catch (e) {
    (async function () {
      const errInfo = errorParse(e);
      const consumer = await new SourceMapConsumer(JSON.parse(sourceMap));

      console.error(
        'Here are some error stack info before launch the server:'
      );
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
      // throw e;
    })();
  }

  return async function (
    unknownthing: unknown
  ): Promise<(...args: unknown[]) => Promise<unknown>> {
    return await caller(unknownthing);
  };
};
