export default func => {
  if (!func) throw new Error('You must provide a function!');
  return { type: 'deal', func };
};

