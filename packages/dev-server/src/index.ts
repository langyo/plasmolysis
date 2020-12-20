export type IEnv =
  'browser' | 'server' | 'native-electron' | 'native-cordova';
export const envMap =
  ['browser', 'server', 'native-electron', 'native-cordova'];

export type IProtocol =
  'http' | 'https' | 'ws' | 'wss' | 'iframe-post' | 'ipc';
export const protocolMap =
  ['http', 'ws', 'iframe-post', 'ipc'];
