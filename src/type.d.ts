declare namespace $$ {
  namespace native {
    function browser(
      type: 'react' | 'vue' | 'ejs',
      config: {
        rootElement?: string;
        defaultRemote?: string;
      },
      methods: {
        [key: string]: (...sth: any[]) => Promise<any>;
      }
    ): void;

    namespace to {
      namespace remote {
        function http(id?: string): {
          get(route: string): Promise<any>;
          run(func: () => Promise<any>): Promise<any>;
        };
        namespace http {
          function get(route: string): Promise<any>;
          function run(func: () => Promise<any>): Promise<any>;
        }

        function websocket(id?: string): {
          get(route: string): Promise<any>;
          run(func: () => Promise<any>): Promise<any>;
        };
        namespace websocket {
          function get(route: string): Promise<any>;
          function run(func: () => Promise<any>): Promise<any>;
        }

        function hybrid(id?: string): {
          get(route: string): Promise<any>;
          run(func: () => Promise<any>): Promise<any>;
        };
        namespace hybrid {
          function get(route: string): Promise<any>;
          function run(func: () => Promise<any>): Promise<any>;
        }
      }
    }
  }

  namespace remote {
    function http(
      framework: 'express' | 'koa',
      config: {
        id?: string;
        port?: number;
      },
      methods: {}
    ): void;
    namespace http {
      function get(route: string): any;
    }

    function websocket(id?: string): (target: any) => any;
    namespace websocket {
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
}
