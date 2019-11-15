const { actions } = require('./require');
const $ = require('./$');

let thunks = {};
let initState = { dialogs: {}, pages: {}, views: {} };

for (let type of ['dialogs', 'pages', 'views']) {
  for (let name of Object.keys(actions[type])) {
    for (let action of Object.keys(actions[type][name])) {
      if (action === 'init') {
        initState[type][name] = actions[type][name].init;
        continue;
      }

      let { taskList } = actions[type][name][action](new $());
      let subThunks = [];

      for (let task of taskList) {
        switch (task.type) {
          case 'setState':
            subThunks.push(next => (payload, dispatch, state) => {
              dispatch({
                type: 'framework.updateState',
                payload: {
                  [type]: {
                    [name]: task.func(payload, state)
                  }
                }
              });
              next(payload, dispatch, state);
            });
            break;
          case 'dispatch':
            subThunks.push(next => (payload, dispatch, state) => {
              let ret = task.func(payload, state);
              if (/^framework\./.test(ret.type)) dispatch({ ...ret });
              else dispatch(thunks[ret.type](ret.payload));
              next(payload, dispatch, state);
            });
            break;
          case 'fetchCombine':
            subThunks.push(next => (payload, dispatch, state) => fetch(task.fetch.host || '' + task.route.path, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              ...task.fetch,
              body: task.send ? JSON.stringify(task.send(payload, state)) : '{}'
            }).then(res => res.json()).then(json => next(json, dispatch, state)));
            break;
          default:
            throw new Error('未知的流动作！');
        }
      }

      thunks[`${type}.${name}.${action}`] = payload => (dispatch, getState) => {
        console.log('The action', `${type}.${name}.${action}`, 'will be executed.')
        let combine = subThunks[subThunks.length - 1](() => console.log('The action', `${type}.${name}.${action}`, 'has been executed.'));
        for(let i = subThunks.length - 2; i >= 0; --i) {
          combine = subThunks[i](combine);
        }
        combine(payload, dispatch, getState());
      };
    }
  }
}

export { thunks, initState };
