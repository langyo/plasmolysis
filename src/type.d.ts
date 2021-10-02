declare namespace native {
  function browser(type: 'react' | 'vue' | 'ejs'): (target: any) => any;
  namespace browser {
    function inject(domSelector: string): any;
  }

  namespace to {
    namespace remote {
      function http(id?: string): {
        get(route: string): Promise<any>;
        run(func: () => Promise<any>): Promise<any>;
      };
      function websocket(id?: string): {
        get(route: string): Promise<any>;
        run(func: () => Promise<any>): Promise<any>;
      };
      function serverless(id?: string): {
        get(route: string): Promise<any>;
        run(func: () => Promise<any>): Promise<any>;
      };
      function hybrid(id?: string): {
        get(route: string): Promise<any>;
        run(func: () => Promise<any>): Promise<any>;
      };
    }
  }
}

declare namespace remote {
  function http(
    framework: 'express' | 'koa',
    id?: string
  ): (target: any) => any;
  namespace http {
    function get(route: string): any;
  }

  function websocket(id?: string): (target: any) => any;
  namespace websocket {
    function get(route: string): any;
  }

  function serverless(
    framework: 'aliyun-fc' | 'tencent-scf',
    id?: string
  ): (target: any) => any;
  namespace serverless {
    function get(route: string): any;
  }

  function hybrid(
    framework: 'electron' | 'cordova',
    id?: string
  ): (target: any) => any;
  namespace hybrid {
    function get(route: string): any;
  }
}
