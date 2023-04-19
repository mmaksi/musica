import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({ isOpen: false }),
  // computed properties for the store and accessible in all components
  getters: {
    hiddenClass: (state) => (!state.isOpen ? 'hidden' : '')
  },
  actions: {
    toggleModal() {
      this.isOpen = !this.isOpen
    }
  }
})
