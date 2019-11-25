export default ({ setState, destoryModel }) => ({
  init: {
    isOpen: true
  },
  close: [
    setState({ isOpen: false })
  ]
});