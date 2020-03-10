export default (funcOrType, id, action, payload) => {
  if (typeof funcOrType === 'function') {
    return { $type: 'dispatch', func: funcOrType };
  } else {
    return { $type: 'dispatch', type: funcOrType, id, action, payload };
  }
};

