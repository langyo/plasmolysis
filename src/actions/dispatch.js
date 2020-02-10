export const $ = (obj1, obj2) => {
  // If we receive an argument, the argument must be a function, return an object that include the dispatcher's name.
  // If we receive two arguments, the first argument must be a string, and the second argument is a function or an object.
  if (obj2) {
    if (!typeof obj1 === 'string') throw new Error('You must provide a string as the first argument!');
    if (!(typeof obj2 === 'object' || typeof obj2 === 'function')) throw new Error('You must provide an object or a function as the second argument!')
    return { type: 'dispatch', obj: obj2, name: obj1 };
  }
  if (!(obj1 && typeof obj1 === 'function')) throw new Error('You must provide a function at least!');
  return { type: 'dispatch', obj: obj1 };
};

export const client = task => async (payload, { setState, replaceState, getState, getInitState, dispatcher }, { type, name }) => {
  console.log('Get payload at dispatch:', payload);
  let ret = typeof task.obj === 'function' ? task.obj(payload, getState()) : task.obj;
  dispatcher(thunks[task.name || ret.type](task.name ? ret : ret.payload));
  return payload;
};