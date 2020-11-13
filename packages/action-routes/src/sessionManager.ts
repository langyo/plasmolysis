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

export interface ISessionInfo {
  ip: string,
  protocol: string,
  lastUpdate?: number,
  alive?: boolean,
  host: string,
  path: string,
  query: { [key: string]: string },
  cookies: {
    [key: string]: ICookie
  }
}

let sessionInfo: { [id: string]: ISessionInfo } = {};
let sessionStream: { [id: string]: Writable } = {};

export function joinSession(
  info: ISessionInfo,
  stream: Writable,
  modifier?: {} // TODO - Such as cookies, heads.
): string {
  const id = generate();
  sessionInfo[id] = info;
  sessionInfo[id].lastUpdate = Date.now();
  sessionInfo[id].alive = true;
  sessionStream[id] = stream;
  return id;
}

export function getCookies(id: string): Readonly<{ [key: string]: ICookie }> {
  if (typeof sessionInfo[id] === 'undefined') {
    throw new Error(`Cannot find the session '${id}'.`);
  }
  return sessionInfo[id].cookies;
}

export function getSessionList(): string[] {
  return Object.keys(sessionInfo);
}

export function getSessionAge(id: string): number {
  if (typeof sessionInfo[id] === 'undefined') {
    throw new Error(`Cannot find the session '${id}'.`);
  }
  return Date.now() - sessionInfo[id].lastUpdate;
}

// Cut down the connection to the client, but keep the session exist.
export function leaveSession(id: string): void {
  if (typeof sessionStream[id] !== 'undefined') {
    delete sessionStream[id];
  }
  if (typeof sessionInfo[id] !== 'undefined') {
    sessionInfo[id].alive = false;
  }
}

// Delete the session, including the entity itself.
export function killSession(id: string): void {
  if (typeof sessionStream[id] !== 'undefined') {
    delete sessionStream[id];
  }
  if (typeof sessionInfo[id] !== 'undefined') {
    delete sessionInfo[id];
  }
}

export function writeToSession(id: string, data: string) {
  return;
}
