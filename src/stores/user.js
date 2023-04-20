import { defineStore } from 'pinia'
// import { createUser, addUser } from '@/includes/firebase'

export const useUserStore = defineStore('user', {
  state: () => ({ isLoggedIn: false })
})
