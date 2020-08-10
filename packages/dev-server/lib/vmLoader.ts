import { Script, createContext } from 'vm';

let extraContext:{ [key: string]: any } = {};
let vm = new Script('');

export function build(code: string, context?:{ [key: string]: any }) {
  vm = new Script(code);
  extraContext = context;
};

export async function send(payload:{ [key: string]: any }) {
  return await new Promise(resolve => {
    const context = createContext({
      ...extraContext,
      __payload: payload,
      __callback: resolve
    });
    vm.runInContext(context);
  });
};