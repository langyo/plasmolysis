export default (funcOrType, id) => {
  if (typeof funcOrType === 'function') {
    return { $type: 'destoryModel', func: funcOrType };
  }
  else if (typeof funcOrType === 'string') {
    if (!id) throw new Error('You must provide the model id!');
    return { $type: 'destoryModel', type: funcOrType, id };
  }
  else throw new Error('The first argument must be a function or a string!');
};

