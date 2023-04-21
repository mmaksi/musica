import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import './assets/base.css'

import './includes/firebase'
import VeeValidatePlugin from './includes/validation'
import { auth } from './includes/firebase'

let authFlag = true
auth.onAuthStateChanged(() => {
  // To mount the Vue instance only once
  if (authFlag) {
    authFlag = false
    createApp(App).use(router).use(createPinia()).use(VeeValidatePlugin).mount('#app')
  }
})
