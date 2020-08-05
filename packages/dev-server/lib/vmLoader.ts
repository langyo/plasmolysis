import { Script, createContext } from 'vm';

let extraContext: object = {};
let vm = new Script('');

export function build(code: string, context?: object) {
  vm = new Script(code);
  extraContext = context;
};

export async function send(payload: object) {
  return await new Promise(resolve => {
    const context = createContext({
      ...extraContext,
      __payload: payload,
      __callback: resolve
    });
    vm.runInContext(context);
  });
};