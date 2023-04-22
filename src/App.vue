<template>
  <AppHeader />

  <RouterView />

  <!-- Auth Modal -->
  <AppAuth />
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppAuth from "./components/AppAuth.vue"
import { useUserStore } from '@/stores/user'
import { mapWritableState } from 'pinia';
import { auth } from "./includes/firebase"

export default {
  name: "App",
  components: {
    AppHeader,
    AppAuth
  },
  computed: {
    ...mapWritableState(useUserStore, ["isLoggedIn"])
  },
  created() {
    if (auth.currentUser) {
      this.isLoggedIn = true;
    }
  }
}
</script>