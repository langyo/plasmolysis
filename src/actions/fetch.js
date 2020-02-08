export const $ = (path, obj1, obj2) => {
  if (typeof path !== 'string') throw new Error('You must provide the route path!');

  // If don't provide obj2, obj1 will be the handle object.
  // Otherwise, obj1 will be the 'send' object, and obj2 will be the 'handle' object.
  if (obj2) {
    // obj1 is the 'send' object, and obj2 is the 'handle' object.
    if (typeof obj1 !== 'function' && typeof obj1 !== 'object') throw new Error('You must provide a function or an object to send the data!');
    if (typeof obj2 !== 'function' && typeof obj2 !== 'object') throw new Error('You must provide a function or an object to handle the request!');

    return { type: 'fetch', path: path, send: obj1, handle: obj2 };
  } else {
    // obj1 is the 'handle' object.
    if (typeof obj1 !== 'function' || typeof obj1 !== 'object') throw new Error('You must provide a function or an object to handle the request!');

    return { type: 'fetch', path: path, send: {}, handle: obj1 };
  }
};

export const client = task => async (payload, { setState, replaceState, state, dispatcher }, { type, name }) => {
  console.log('Get payload at fetch:', payload);
  let ret = await (await fetch(task.host + task.path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    ...task.fetch,
    body: JSON.stringify(typeof task.send === 'function' ? task.send({ ...payload, $id: null }, state) : task.send)
  })).json();
  return { ...ret, $id: payload && payload.$id || null };
};

export const server = task => async (context, req, res) => {
  console.log('New service:', task.path);
  task.handle(req.body, context, json => {
    res.send(JSON.stringify(json));
    res.end();
  });
};