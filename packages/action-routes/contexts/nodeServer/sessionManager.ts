import {
  ISessionManager
} from '../../index';
import {
  IProjectPackage
} from '../../../core';

import { generate } from 'shortid';
import { from, merge } from "seamless-immutable";

export function sessionManager(
  projectPackage: IProjectPackage,
  contexts: Readonly<{ [key: string]: (...args: any[]) => any }>
): ISessionManager {
  let sessionChecksum: { [id: string]: string } = {};
  let sessionState: { [id: string]: Readonly<{ [key: string]: any }> } = {};
  let sessionLastUpdate: { [id: string]: number } = {};

  function joinSession(id: string, initState?: { [key: string]: any }): string {
    const checksum = generate();
    sessionChecksum[id] = checksum;
    sessionState[id] = from(initState || {});
    sessionLastUpdate[id] = Date.now();
    return checksum;
  }

  function verifySession(id: string, checksum: string): boolean {
    return sessionChecksum[id] === checksum;
  }

  function getSessionState(id: string): Readonly<{ [key: string]: any }> {
    if (typeof sessionState[id] === 'undefined') {
      throw new Error(`Cannot find the session '${id}'.`);
    }
    return sessionState[id];
  }

  function setSessionState(
    id: string,
    state: Readonly<{ [key: string]: any }>
  ): void {
    if (typeof sessionState[id] === 'undefined') {
      throw new Error(`Cannot find the session '${id}'.`);
    }
    sessionState[id] = merge(sessionState[id], state);
    sessionLastUpdate[id] = Date.now();
  }

  function getSessionList(): { [id: string]: string } {
    return sessionChecksum;
  }

  function getSessionAge(id: string): number {
    if (typeof sessionLastUpdate[id] === 'undefined') {
      throw new Error(`Cannot find the session '${id}'.`);
    }
    return Date.now() - sessionLastUpdate[id];
  }

  function leaveSession(id: string): void {
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

  return Object.freeze({
    joinSession,
    verifySession,
    getSessionState,
    setSessionState,
    getSessionList,
    getSessionAge,
    leaveSession
  });
}