import { getServerRouter } from '../lib/actionLoader';

export default async (type, payload, routes, configs) => {
  const ret = await getServerRouter(type)(payload, routes[type], configs);
  if (!ret) return { successFlag: false, payload: {} };
  else return { successFlag: true, payload: ret }
};