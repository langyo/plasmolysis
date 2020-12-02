export function exprVerify(expr: string, str: string): boolean {
  // Expression does not allow two consecutive '*'.
  if (expr.indexOf('**') >= 0) {
    throw new Error('Expression does not allow two consecutive \'*\'.');
  }

  const subExpr = expr.split('*');
  let pos = 0;
  for (const expr of subExpr) {
    if (expr === '') { continue; }
    while (true) {
      pos = str.indexOf(expr[0], pos);
      if (pos === -1) return false;

      let hasMatched = true;
      for (let i = 0; i < expr.length; ++i, ++pos) {
        if (expr[i] === '?') { continue; }
        else if (expr[i] !== str[pos]) {
          hasMatched = false;
          break;
        }
      }
      if (hasMatched) { break; }
    }
  }
  return true;
}
