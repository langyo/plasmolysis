function http(type: 'express' | 'koa', connection?: any) {
  return function (target: Function) {

  };
}

http.get = function (path: string) {
  let ret = function (target: any, propertyKey: string) {

  };
  ret.bind = function (webClass: Function) {

  }
  return ret;
};

http.inject = function () {
  return function (target: any, propertyKey: string) {

  };
};

function websocket(connection?: any) {
  return function (target: Function) {

  }
}

websocket.get = function (path: string) {
  let ret = function (target: any, propertyKey: string) {

  };
  ret.bind = function (webClass: Function) {

  }
  return ret;
};

websocket.inject = function () {
  return function (target: any, propertyKey: string) {

  };
};

function serverless(type: 'aliyun-fc' | 'tencent-scf', connection?: any) {
  return function (target: Function) {

  };
}

serverless.get = function (path: string) {
  let ret = function (target: any, propertyKey: string) {

  };
  ret.bind = function (webClass: Function) {

  }
  return ret;
};

serverless.inject = function () {
  return function (target: any, propertyKey: string) {

  };
};

function hybrid(type: 'electron' | 'cordova', connection?: any) {
  return function (target: Function) {

  };
}

hybrid.get = function (path: string) {
  let ret = function (target: any, propertyKey: string) {

  };
  ret.bind = function (webClass: Function) {

  }
  return ret;
};

hybrid.inject = function () {
  return function (target: any, propertyKey: string) {

  };
};

export const native = {
  http, websocket, serverless, hybrid
};
