import { generate } from 'shortid';
import { Writable } from 'stream';

interface ICookie {
  value: string,
  maxAge?: number,
  expires?: Date,
  path?: string,
  domain?: string,
  secure?: boolean,
  httpOnly?: boolean,
  sameSite?: boolean,
  signed?: boolean
}

export type IIpv4 = [number, number, number, number];
export type IIpv6 = [number, number, number, number, number, number];

export type IProtocol = 'http' | 'webspcket';

export interface ISessionInfo {
  ip: IIpv4 | IIpv6,
  ipRoute: IIpv4[] | IIpv6[],
  cookies: {
    [key: string]: ICookie
  },
  verifyString: string,
  lastVerifyRefreshTime: number
}

export interface IActiveConnection {
  protocol: IProtocol,
  port: number,
  birth: number,
  lastUpdate: number,
  lost: string,
  path: string,
  query: { [key: string]: string },
  heads: { [key: string]: string },
}

let activeSessions: { [ip: string]: ISessionInfo } = {};
let activeConnections: {
  [ip: string]: {
    [id: string]: IActiveConnection & { stream: Writable }
  }
} = {};

export function joinSession(
  sessionInfo: ISessionInfo,
  connectionInfo: IActiveConnection,
  stream: Writable
): string {
  const ip = sessionInfo.ip.join('.');
  activeSessions[ip] = sessionInfo;

  const id = generate();
  if (typeof activeConnections[ip] === 'undefined') {
    activeConnections[ip] = {};
  }
  activeConnections[ip][id] = { ...connectionInfo, stream };

  return id;
}

export function getSessionList(): string[] {
  return Object.keys(activeSessions);
}

export function getConnectionList(ip: string): string[] {
  return Object.keys(activeConnections[ip] && activeConnections[ip] || {});
}

export function getSessionInfo(ip: string): ISessionInfo {
  if (typeof activeSessions[ip] === 'undefined') {
    throw new Error(`The session '${ip}' is not exist.`);
  }
  return activeSessions[ip];
}

export function getConnectionInfo(ip: string, id: string) {
  if (
    typeof activeConnections[ip] === 'undefined' ||
    typeof activeConnections[ip][id] === 'undefined'
  ) {
    throw new Error(
      `The connection '${id}' at the address '${ip}' is not exist.`
    );
  }
  return activeConnections[ip][id];
}

// Cut down the connection to the client, but keep the session exist.
export function leaveConnection(ip: string, id: string): void {
  if (
    typeof activeSessions[ip] !== 'undefined' &&
    typeof activeConnections[ip] !== 'undefined' &&
    typeof activeConnections[ip][id] !== 'undefined'
  ) {
    activeConnections[ip][id].stream.end();
    delete activeConnections[ip][id];
  }
}

// Delete the session, including the entity itself.
export function killSession(ip: string): void {
  if (typeof activeConnections[ip] !== 'undefined') {
    for (const id of Object.keys(activeConnections[ip])) {
      activeConnections[ip][id].stream.end();
    }
    delete activeConnections[ip];
  }
  if (typeof activeSessions[ip] !== 'undefined') {
    delete activeSessions[ip];
  }
}

export function writeToSession(id: string, data: string) {
  return;
}
