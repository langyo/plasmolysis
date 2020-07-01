export default async (type, payload, routes, configs, actionManager) => {
  const ret = await actionManager.getServerRouter(type)(payload, routes[type], configs);
  if (!ret) return { hasContentFlag: false, payload: {} };
  else return { hasContentFlag: true, payload: ret }
};