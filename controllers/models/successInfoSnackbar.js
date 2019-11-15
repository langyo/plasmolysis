export default {
  init: {
    isOpen: false
  },

  open: $ => $.setState(() => ({ isOpen: true })),
  close: $ => $.setState(() => ({ isOpen: false }))
}