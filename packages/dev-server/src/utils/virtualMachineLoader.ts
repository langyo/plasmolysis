import { Script, createContext } from 'vm';
import { parse as errorParse } from 'error-stack-parser';
import { SourceMapConsumer } from 'source-map';

export function vmLoader(
  { code, sourceMap }: { code: string, sourceMap: string },
  caller: (...args: any[]) => Promise<any>
) {
  const context = createContext({
    global,
    process,
    require,
    console,
    __CALLBACK: (func: (...args: any[]) => Promise<any>) => caller = func
  });

  try {
    (new Script(code)).runInContext(context);
    console.log('The server has been loaded.');
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
      throw e;
    })();
  }

  return async function (
    anything: any
  ): Promise<(...args: any[]) => Promise<any>> {
    return await caller(anything);
  };
};