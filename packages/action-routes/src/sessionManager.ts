import { generate } from 'shortid';
import { from, merge } from "seamless-immutable";

let sessionChecksum: { [id: string]: string } = {};
let sessionState: { [id: string]: Readonly<{ [key: string]: any }> } = {};
let sessionLastUpdate: { [id: string]: number } = {};

export function joinSession(
  id: string,
  initState?: { [key: string]: any }
): string {
  const checksum = generate();
  sessionChecksum[id] = checksum;
  sessionState[id] = from(initState || {});
  sessionLastUpdate[id] = Date.now();
  return checksum;
}

export function verifySession(id: string, checksum: string): boolean {
  return sessionChecksum[id] === checksum;
}

export function getSessionState(id: string): Readonly<{ [key: string]: any }> {
  if (typeof sessionState[id] === 'undefined') {
    throw new Error(`Cannot find the session '${id}'.`);
  }
  return sessionState[id];
}

export function setSessionState(
  id: string,
  state: Readonly<{ [key: string]: any }>
): void {
  if (typeof sessionState[id] === 'undefined') {
    throw new Error(`Cannot find the session '${id}'.`);
  }
  sessionState[id] = merge(sessionState[id], state);
  sessionLastUpdate[id] = Date.now();
}

export function getSessionList(): { [id: string]: string } {
  return sessionChecksum;
}

export function getSessionAge(id: string): number {
  if (typeof sessionLastUpdate[id] === 'undefined') {
    throw new Error(`Cannot find the session '${id}'.`);
  }
  return Date.now() - sessionLastUpdate[id];
}

export function leaveSession(id: string): void {
  if (typeof sessionChecksum[id] !== 'undefined') {
    delete sessionChecksum[id];
  }
  if (typeof sessionState[id] !== 'undefined') {
    delete sessionState[id];
  }
  if (typeof sessionLastUpdate[id] !== 'undefined') {
    delete sessionLastUpdate[id];
  }
}