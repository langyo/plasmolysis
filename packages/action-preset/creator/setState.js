export default obj => typeof obj === 'function' ? { $type: 'setState', func: obj } : { $type: 'setState', obj };

