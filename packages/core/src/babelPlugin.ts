export default ({ type: t }) => ({
  visitor: {
    Directive({ node, getFunctionParent }, { opts: {
      targetEnv
    }}) {
      if (node.value.value.split(0, 2) === 'on') {
        if (node.value.value !== `on ${targetEnv}`) {
          // Different environment needs to clean the codes.
          if (t.isProgram(getFunctionParent())) {
            getFunctionParent().body.map(node => node.remove());
          } else if (t.isFunction(getFunctionParent())) {
            getFunctionParent().get('body.body').map(node => node.remove());
          }
        }
      }
    }
  }
});

