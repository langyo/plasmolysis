/// <reference path="./type.d.ts" />

declare global {
  export const __callback: (ret: (payload: { [key: string]: any }) => Promise<RequestForwardObjectType>) => void;
};

import { actionManager as actionManagerFactory } from 'nickelcat';

const actionManager: ActionManager = actionManagerFactory(require('./__nickelcat_staticRequire.js'));
const streamManager: StreamManager = actionManager.getContextFactory('nodeServer')('streamManager');
const modelManager: ModelManager = actionManager.getContextFactory('nodeServer')('modelManager');

import { renderToString } from 'react-dom/server';
// import { ServerStyleSheets } from '@material-ui/core/styles';

__callback(async ({
  ip, protocol, host, path, query, cookies
}) => {
  try {

  } catch (e) {
    return {
      processed: true,
      code: 404,
      type: 'text/html',
      body: `
<html>
<head>
    <title>RUNTIME ERROR</title>
</head>
<body>
  <h2>Oops!</h2>
  <p>${e.message}</p>
  </body>
</html>
    `
    };
  }
});