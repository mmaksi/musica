<template>
  <AppHeader />

  <RouterView />
  <AppPlayer />

  <!-- Auth Modal -->
  <AppAuth />
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppAuth from "./components/AppAuth.vue"
import AppPlayer from "./components/Player.vue"
import { useUserStore } from '@/stores/user'
import { mapWritableState } from 'pinia';
import { auth } from "./includes/firebase"

export default {
  name: "App",
  components: {
    AppHeader,
    AppAuth,
    AppPlayer
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