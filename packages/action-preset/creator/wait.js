export default length => {
  if (typeof length !== 'number') throw new Error('You must provide a number!');
  return { $type: 'wait', length };
};

