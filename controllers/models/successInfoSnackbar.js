export default ({ setState, dispatch }) => ({
  init: {
    isOpen: false
  },

  open: [
    setState(() => ({ isOpen: true }))
  ],
  close: [
    setState(() => ({ isOpen: false }))
  ]
});