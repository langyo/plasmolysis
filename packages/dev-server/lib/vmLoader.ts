import { Script, createContext } from 'vm';

export default async (code: string) => {
  let vm = new Script(code);

  return {
    send: async (payload: object) => {
      return await new Promise(resolve => {
        const context = createContext({
          __payload: payload,
          __callback: resolve
        });
        vm.runInContext(context);
      });
    },
    restart: (code: string) => vm = new Script(code)
  };
};
