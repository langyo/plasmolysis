import { generate } from 'shortid';

export const $ = (obj1, obj2) => {
  if (typeof obj1 === 'function') {
    return { type: 'createModel', func: obj1 };
  }
  else if (typeof obj1 === 'string') {
    return { type: 'createModel', name: obj1, payload: obj2 === undefined ? {} : obj2 };
  }
  else throw new Error('The first argument must be a function or a string!');
};

export const client = task => async (payload, { setState, replaceState, getState, getInitState, dispatcher }, { type, name }) => {
  console.log('Get payload at createModel:', payload);
  let id = generate();
  if (task.func) {
    let ret = task.func(payload);
    if (!ret.name) throw new Error('You must provide the name of the model!');
    await setState({
      models: {
        [ret.name]: {
          [id]: {
            ...(typeof getInitState().models[type] === 'function' ? getInitState().models[type](ret.payload) : getInitState().models[type]),
            $id: id
          }
        }
      }
    });
  } else {
    await setState({
      models: {
        [task.name]: {
          [id]: {
            ...(typeof getInitState().models[type] === 'function' ? getInitState().models[type](task.payload) : getInitState().models[type]),
            $id: id
          }
        }
      }
    });
  }
  return payload;
};