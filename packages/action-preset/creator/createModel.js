export default (funcOrType, initState, name) => { 
  if (typeof funcOrType === 'function') {
    return { $type: 'createModel', func: funcOrType };
  }
  else if (typeof funcOrType === 'string') {
    return {
      $type: 'createModel',
      type: funcOrType,
      payload: initState === undefined ? {} : initState,
      name
    };
  }
  else throw new Error('The first argument must be a function or a string!');
};

