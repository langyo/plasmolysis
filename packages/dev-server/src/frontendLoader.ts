import { IRuntimeObject } from 'nickelcat';
import { webpackCompiler } from './utils';

let compiledSourceCode: { [route: string]: string } = {};
let compiledSourceCodeMap: { [route: string]: string } = {};
let compiledStaticSourceCode: string[] = [];
let compiledStaticSourceCodeMap: string[] = [];

export async function installComponent(
  component: IRuntimeObject,
  controllers: { [key: string]: IRuntimeObject },
  filePath: string,
  options: {
    routePath: string,
    isGlobalComponent?: boolean,
    isPageEntry?: boolean
  }
) {
  switch (component.type) {
    case 'preset.renderReactComponent':
      const { code, sourceMap } = await webpackCompiler(`
window.__nickelcat_action_preset.modelManager.storageComponent(
  ${options.routePath},
  require(${filePath}).component
);
      `, 'web', {
        externals: {
          'react': '__react',
          'react-dom': '__react_dom',
          'nickelcat': '__nickelcat',
          'nickelcat-action-preset': '__nickelcat_action_preset',
          'nickelcat-action-routes': '__nickelcat_action_routes'
        }
      });
      compiledSourceCode[options.routePath] = code;
      compiledSourceCodeMap[options.routePath] = sourceMap;
      break;
    case 'preset.renderVueComponent':
    case 'preset.renderEjsComponent':
    case 'preset.renderStaticHtml':
    default:
      throw new Error(`Unsupport component type '${component.type}'`);
  }

  // TODO - Register the other controllers.
}

export async function uninstallComponent() {
}
