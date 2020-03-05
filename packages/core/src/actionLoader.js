let actions = {};

export const loadActionModel = model => {
  if (typeof model !== 'object') throw new Error('The action provider must be an object.');

  if (!(model.$name && typeof model.$name === 'string')) throw new Error('You must provide the action provider\'s name');
  if (!(model.$evaluator && typeof model.$evaluator === 'object')) throw new Error('You must provide the action evaluators.');

  if (model.$name === 'preset') {
    // The special provider 'preset' will store to the root object directly.
    for (let key of Object.keys(model.$evaluator)) {
      const { client, server, local } = model.$evaluator[key];
      if (!(client || server || local)) throw new Error(`You seem not provide any effective evaluator at the action '${key}'.`);
      
      if (!(model[key] && typeof model[key] === 'function')) throw new Error(`You must provide a factory function for users at the action '${key}'`);

      actions[key] = { };
      if (client) actions[key] = client;
      if (server) actions[key] = server;
      if (local) actions[key] = local;
    }
  } else {
    // Otherwise, we will add the namespace before the actions' name.
    for (let key of Object.keys(model.$evaluator)) {
      const { client, server, local } = model.$evaluator[key];
      if (!(client || server || local)) throw new Error(`You seem not provide any effective evaluator at the action '${key}'.`);
      
      if (!(model[key] && typeof model[key] === 'function')) throw new Error(`You must provide a factory function for users at the action '${key}'`);

      actions[`${model.$name}.${key}`] = { };
      if (client) actions[`${model.$name}.${key}`] = client;
      if (server) actions[`${model.$name}.${key}`] = server;
      if (local) actions[`${model.$name}.${key}`] = local;
    }
  }
};

export const requireActionModel = path => {
  const model = require(path);
  return loadActionModel(model.default || model);
};

export const getActions = () => actions;

