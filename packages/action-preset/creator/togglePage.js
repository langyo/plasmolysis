export default (typeOrFunc, initState = {}) =>
  typeof typeOrFunc === 'function' ?
    { $type: 'togglePage', func: typeOrFunc } :
    { $type: 'togglePage', type: typeOrFunc, initState };
