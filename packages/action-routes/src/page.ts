export interface IMethods {
  setGlobalState(key: string, value: unknown): void;
  setState(key: string, value: unknown): void;

  togglePage(
    type: string,
    initState: { [key: string]: unknown }
  ): void;
  setPageTitle(title: string): void;
  setCookie(
    key: string, value: string,
    options: {
      // The default is valid only for this conversation.
      expire?: Date,
      domain?: string,
      path?: string,
      sameSite?: 'none' | 'strict' | 'lax',
      // Open security options by default.
      secure?: boolean
    }
  ): void;
}

export const parents = ['component', 'route'];
export const requiredItems = ['match', 'render', 'init'];
export const privateMethods = {

}
export const globalMethods = {
  togglePage(
    type: string,
    initState: { [key: string]: unknown }
  ): void {
    window.history.pushState(
      initState, '',
      `${type}${initState && typeof initState === 'object' && Object.keys(initState).length > 0 ?
        `?${Object.keys(initState)
          .map(key => `${key}=${(
            typeof initState[key] === 'object'
            || Array.isArray(initState[key])
          ) && encodeURI(JSON.stringify(initState[key]))
            || initState[key]
            }`)
          .join('&')
        }` : ''
      }`);
  },
  setPageTitle(title: string): void {
    document.title = title;
  },
  setCookie(
    key: string, value: string,
    { expire, domain, path, sameSite, secure }: {
      // The default is valid only for this conversation.
      expire?: Date,
      domain?: string,
      path?: string,
      sameSite?: 'none' | 'strict' | 'lax',
      // Open security options by default.
      secure?: boolean
    } = {}
  ): void {
    let options: string[] = [];
    if (expire) {
      options.push(`Expires=${expire.toUTCString()}`);
    }
    if (domain) {
      if (
        !/^\.?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/
          .test(domain)
      ) {
        throw new Error(`Illegal domain: '${domain}'.`);
      }
      options.push(`Domain=${domain}`);
    }
    if (path) {
      if (!/^(\/\w+)+$/.test(path)) {
        throw new Error(`Illegal path: '${path}'.`);
      }
      options.push(`Path=${path}`);
    }
    if (sameSite) {
      options.push(`SameSite=${sameSite}`);
    }
    if (secure || true) {
      options.push('Secure');
    }

    document.cookie = `${key}=${value}${options.join('; ')}`;
  }
};

export function constructor(
  pkg: { [key: string]: unknown },
  variants: { [key: string]: unknown }
): string {
  // TODO - Returns the variants' generator id.
  return '';
}

export function variantsGenerator(id: string) {

}
