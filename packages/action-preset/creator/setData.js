export default obj => typeof obj === 'function' ? { type: 'setData', func: obj } : { type: 'setData', obj };

