export function splitThroughRegex(expr: string, str: string): string[] {
  let ret: string[] = [];
  let lastPos = 0, pos = Math.min(str.indexOf(expr), str.indexOf('/'));

  while (pos > -1) {
    if (str[pos] === expr) {
      ret.push(str.substr(lastPos, pos));
      pos += expr.length;
      lastPos = pos;
    } else {
      for (
        pos = str.indexOf('/', pos + 1);
        str[pos - 1] === '\\';
        pos = str.indexOf('/', pos + 1)
      ) {
        if (pos < 0) {
          throw new Error('Incomplete regular expressions.');
        }
        pos += 1;
      }
    }
    pos = Math.min(str.indexOf(expr, pos), str.indexOf('/', pos));
  }
  ret.push(str.substr(lastPos));
  return ret;
}
