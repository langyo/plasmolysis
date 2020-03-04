export default (test = () => true, tasks, path, { type, name }, { setState, replaceState, getState }) => async payload => {
  // TODO It will find a better way to analyse all of the components,
  //      not to use the variants 'type' and 'name'.
  //      Also, the key 'data' in the state tree is depreated.
  //      One of the ways is just using the compoent's state only,
  //      and the global data will be stored at the global variant in this
  //      framework.
  if (!test(payload, getState()[type][name], getState().data)) {
    console.log(`The action ${path} has been skiped.`);
    return payload;
  }
  console.log('Get payload', payload);
  console.log(`The action ${path} will be executed`);
  for (let i = 0; i < tasks.length; ++i) {
    console.log('Middle process', tasks[i], 'at', i, ', the total length is', tasks.length);
    if (!Array.isArray(tasks[i])) {
      try {
        payload = await actionTypes[tasks[i].type](tasks[i])(payload, {
          setState: state => new Promise(resolve => setState(state, resolve)),
          replaceState: state => new Promise(resolve => replaceState(state, resolve)),
          getState,
          dispatcher: (type, obj) => {
            if (!controllerStreams[type]) throw new Error('No corresponding controller found.')
            controllerStreams[type](obj);
          },
          getInitState: () => initState
        }, { type, name });
        console.log(`The action ${path} has runned to step ${i}, the payload is`, payload);
      } catch (e) {
        console.error(`The action ${path} failed to execute, because`, e);
        throw e;
      }
    } else {
      payload = await createTasks(tasks[i][0], tasks[i].slice(1), `${path}[${i}]`, { type, name })(payload);
      console.log(`The action ${path}[${i}] has been executed.`);
    }
  }
  return payload;
};

