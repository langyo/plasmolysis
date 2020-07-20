import { PackageInfo } from "./type";

let actions = {};

export default (packageInfo: PackageInfo) => {
  let translators = {};
  let executors = {};

  function getTranslator(platform, name) {

  }

  function getExecutor(platform, name) {

  }

  return Object.seal({
    getTranslator,
    getExecutor
  });
};
