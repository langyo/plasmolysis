declare namespace remote {
  function browser(type: 'react' | 'vue' | 'ejs'): (target: any) => any;
  namespace browser {
    function inject(domSelector: string): any;
  }
}

declare namespace native {
  function http(framework: 'express' | 'koa'): (target: any) => any;
  namespace http {
    function get(route: string): any;
  }

  function websocket(): (target: any) => any;
  namespace websocket {
    function get(route: string): any;
  }

  function serverless(
    framework: 'aliyun-fc' | 'tencent-scf'
  ): (target: any) => any;
  namespace serverless {
    function get(route: string): any;
  }

  function hybrid(framework: 'electron' | 'cordova'): (target: any) => any;
  namespace hybrid {
    function get(route: string): any;
  }
}
