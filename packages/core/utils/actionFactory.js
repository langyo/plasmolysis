export default ({ $$type, creator, translator, executor }) => {
  // Arguments' check
  if (!Array.isArray(creator)) throw new Error('You should provide an array as the creators\' list.');
  for (const { func, paras } of creator) {
    if (!Array.isArray(paras)) throw new Error('One of the arguments\' declaration is not the array.');
    if (typeof func !== 'function') throw new Error('You should provide a function as the action object creator.');
  }
  if (translator) {
    for (const key of Object.keys(translator)) {
      if (['client', 'serverRouter', 'server', 'nativeRouter', 'native'].indexOf(key) < 0) throw new Error(`Unknown translator type '${key}'.`);
      if (!Array.isArray(translator[key])) throw new Error('You should provide an array as the translators\' list');
      if (translator[key].length !== creator.length) throw new Error();
    }
  }
  if (!executor) throw new Error('You must provide the executor!');
  for (const key of Object.keys(executor)) {
    if (['client', 'serverRouter', 'server', 'nativeRouter', 'native'].indexOf(key) < 0) throw new Error(`Unknown executor type '${key}'.`);
    if (!Array.isArray(executor[key])) throw new Error('You should provide an array as the executors\' list');
    if (executor[key].length !== creator.length) throw new Error();
  }

  return {
    creator: (...args) => {
      let availableFunc = creator
        .map(({ paras, func }, $$factoryId) => ({ paras, $$factoryId, func }))
        .filter(({ paras }) => args.length === paras.length)
        .filter(({ paras }) => {
          for (let i = 0; i < args.length; ++i) {
            if (paras[i] === 'array') {
              if (!Array.isArray(args[i])) return false;
              else continue;
            }
            else if (paras[i] !== typeof args[i]) return false;
          }
          return true;
        });
      if (availableFunc.length > 1) throw new Error('Matched more than one functions, can\'t confirm which perform the function.');
      if (availableFunc.length === 0) throw new Error('No matched function!');

      const retObj = {
        ...availableFunc[0].func.apply(null, args),
        $$factoryId: availableFunc[0].$$factoryId,
        $$type
      };

      return {
        ...retObj,
        catch: catchStream => {
          if (!Array.isArray(catchStream)) throw new Error('You must provide an array as the exception handler.');
          return {
            ...retObj,
            $$catch: catchStream
          };
        }
      };
    },
    translator: translator ? Object.keys(translator).reduce((reduced, key) => ({
      ...reduced,
      [key]: (obj, extraArgs) =>
        (translator[key][obj.$$factoryId](obj, extraArgs))
    })) : {},
    executor: Object.keys(executor).reduce((reduced, key) => ({ ...reduced, [key]: obj => executor[key][obj.$$factoryId](obj) }), {})
  }
};