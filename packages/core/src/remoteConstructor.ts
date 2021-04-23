function browser<T extends { new(...args: any[]): any }>(target: T) {
  return class extends target {

  };
}

browser.entry = function (
  framework: 'react' | 'vue' | 'ejs', domElement: string
) {
  return function (target: any, propertyKey: string) {

  }
};

export const remote = {
  browser
};
