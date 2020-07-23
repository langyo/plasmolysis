import {
  Platforms,
  TranslatorFunc,
  ExecutorFunc,
  PackageInfo
} from "./type";

type Translators = {
  [platform in Platforms]: {
    [name: string]: TranslatorFunc
  }
};
type Executors = {
  [platform in Platforms]: {
    [name: string]: ExecutorFunc
  }
};

let translators: Translators = {
  webClient: {},
  nodeServer: {},
  electronClient: {},
  cordovaClient: {},
  flutterClient: {}
};
let executors: Executors = {
  webClient: {},
  nodeServer: {},
  electronClient: {},
  cordovaClient: {},
  flutterClient: {}
};

export function loadPackage(packageInfo: PackageInfo) {
}

export function getTranslator(platform: Platforms, name: string): TranslatorFunc {
  if (typeof translators[platform][name] === 'undefined') throw new Error(`Unknown translator '${name}'`);
  return translators[platform][name];
}

export function getExecutor(platform: Platforms, name: string): ExecutorFunc {
  if (typeof executors[platform][name] === 'undefined') throw new Error(`Unknown executor '${name}'`);
  return executors[platform][name];
}
