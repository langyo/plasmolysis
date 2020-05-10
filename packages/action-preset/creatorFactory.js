export default (name, obj) =>
  (...args) =>
    ({ ...obj.creator(...args), $$type: name });
