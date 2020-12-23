import {
  togglePage as togglePageInside
} from '../../routeManager';

// TODO - It will be a global method.

export function togglePage(
  type: string,
  initState: { [key: string]: any }
): void {
  togglePageInside(type, initState);
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
}

