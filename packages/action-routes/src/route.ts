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

export type IProtocol = 'http' | 'websocket';

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
  path: string,
  query: { [key: string]: string },
  heads: { [key: string]: string },
}

export interface IMethods {
  pushHead(key: string, value: string): void;
  pushContext(value: string): void;
};

export const requiredItems = ['match', 'route'];
export const privateMethods = {
  pushHead: variants => (key: string, value: string) => { return; },
  pushContext: variants => (value: string) => { return; }
}

export function constructor(
  pkg: { [key: string]: unknown },
  variants: { [key: string]: unknown }
): string {
  // TODO - Returns the variants' generator id.
  return '';
}

export function variantsGenerator(id: string) {

}
