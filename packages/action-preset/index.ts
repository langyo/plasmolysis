export default {
  $routers: {
    server: {
      http: async (payload, routes, configs) => {
        if (!routes[payload.path]) return;
        return await routes[payload.path](payload, configs);
      }
    }
  }
};

export function createModel() {

};
export function deal() {

};
export function destoryModel() {

};
export function dispatch() {
  
};
export function fetch() {
  
};
export function setData() {
  
};
export function setState() {
  
};
export function togglePage() {
  
};
export function wait() {
  
};
