import { generate } from 'shortid';

let pageTitle: string = '';
let pageID: string = generate();

export function setPageTitle(currentTitle: string): void {
  pageTitle = currentTitle;
  document.title = pageTitle;
}

export function getPageTitle(): string {
  return pageTitle;
}

export function setCookie(
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
) {
  let options: string[] = [];
  if (typeof expire !== 'undefined') {
    options.push(`Expires=${expire.toUTCString()}`);
  }
  if (typeof domain !== 'undefined') {
    if (
      !/^\.?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/
        .test(domain)
    ) {
      throw new Error(`Illegal domain: '${domain}'.`);
    }
    options.push(`Domain=${domain}`);
  }
  if (typeof path !== 'undefined') {
    if (!/^(\/\w+)+$/.test(path)) {
      throw new Error(`Illegal path: '${path}'.`);
    }
    options.push(`Path=${path}`);
  }
  if (typeof sameSite !== 'undefined') {
    options.push(`SameSite=${sameSite}`);
  }
  if (typeof secure === 'undefined' || secure) {
    options.push('Secure');
  }

  document.cookie = `${key}=${value}${options.join('; ')}`;
}

export function getCookies(): { [key: string]: string } {
  return document.cookie.split(';').map(str => {
    return {
      key: str.substr(0, str.indexOf('=')).trimLeft(),
      value: str.substr(str.indexOf('=') + 1).trimRight()
    };
  }).reduce((obj, { key, value }) => ({
    ...obj,
    [key]: value
  }), {});
}
