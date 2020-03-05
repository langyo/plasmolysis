const merge = (obj1, obj2) => {
  let ret = { ...obj1 };
  for (let i of Object.keys(obj2)) {
    if (Array.isArray(obj2[i])) {
      ret[i] = Array.prototype.slice.call(obj2[i]);
    }
    else if (typeof ret[i] === 'object' && typeof obj2[i] === 'object') {
      ret[i] = merge(ret[i], obj2[i]);
    }
    else if (obj2[i] === null) {
      ret[i] = Object.keys(ret[i]).filter(key => key !== i).reduce(
        (obj, key) => ({ ...obj, [key]: ret[key] }), {}
      );
    }
    else ret[i] = obj2[i];
  };
  return ret;
};

export default merge;
