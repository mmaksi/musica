import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Manage from '@/views/Manage.vue'
import Song from '@/views/Song.vue'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About
  },
  {
    path: '/manage-music',
    name: 'manage',
    component: Manage
  },
  {
    path: '/manage',
    redirect: { name: 'manage' },
    meta: {
      requiresAuth: true
    }
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClasses: 'text-yellow-500'
})

// Global Guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore() // don't move this line outside the function
  if (!to.meta.requiresAuthent) {
    next()
    return
  }

  if (userStore.isLoggedIn) next()
  next({ name: 'home' })
})

export default router
