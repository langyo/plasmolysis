function browser(target: Function) {

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
