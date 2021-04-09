// tslint:disable-next-line: no-default-export
export default ({ types: t }) => ({
  visitor: {
    Directive({ node, parent }, { opts: {
      targetEnv
    } }) {
      if (node.value.value.substr(0, 2) === 'on') {
        if (node.value.value !== `on ${targetEnv}`) {
          // Different environment needs to clean the codes.
          if (t.isProgram(parent)) {
            parent.body.map(node => node.remove());
          } else if (t.isBlockStatement(parent)) {
            parent.body.body.map(node => node.remove());
          }
        }
      }
    }
  }
});

