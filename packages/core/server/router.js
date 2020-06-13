export default async (type, payload, routes, configs, actionManager) => {
  const ret = await actionManager.getServerRouter(type)(payload, routes[type], configs);
  if (!ret) return { successFlag: false, payload: {} };
  else return { successFlag: true, payload: ret }
};