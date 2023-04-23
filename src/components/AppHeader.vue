<template>
    <!-- Header -->
    <header id="header" class="bg-gray-700">
        <nav class="container mx-auto flex justify-start items-center py-5 px-4">
            <!-- App Name -->
            <RouterLink class="text-white font-bold uppercase text-2xl mr-4" :to="{ name: 'home' }"
                exact-active-class="no-active">Music
            </RouterLink>

            <div class="flex flex-grow items-center">
                <!-- Primary Navigation -->
                <ul class="flex flex-row mt-1">
                    <!-- Navigation Links -->
                    <li>
                        <RouterLink class="px-2 text-white" :to="{ name: 'about' }">About</RouterLink>
                    </li>
                    <li v-if="!userStore.isLoggedIn">
                        <a class="px-2 text-white" href="#" @click="toggleAuthModal">Login
                            /
                            Register</a>
                    </li>
                    <template v-else>
                        <li>
                            <RouterLink class="px-2 text-white" :to="{ name: 'manage' }">Manage</RouterLink>
                        </li>
                        <li>
                            <a class="px-2 text-white" href="#" @click.prevent="signOut">Logout</a>
                        </li>
                    </template>
                </ul>
                <ul class="ml-auto flex flex-row mt-1">
                    <li>
                        <a hxref="#" class="px-2 text-white" @click.prevent="changeLocaleNL">Dutch</a>
                    </li>
                    <li>
                        <a hxref="#" class="px-2 text-white" @click.prevent="changeLocaleEN">English</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
import { useModalStore } from '@/stores/modal'
import { mapActions, mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import { logoutUser } from "../includes/firebase"

export default {
    name: "AppHeader",
    computed: {
        ...mapStores(useUserStore),
        currentLocale() {
            return this.$i18n.locale === 'nl' ? 'Dutch' : 'English';
        }
    },
    methods: {
        ...mapActions(useModalStore, ['toggleModal']),
        toggleAuthModal() {
            // this.modalStore.isOpen = !this.modalStore.isOpen
            this.toggleModal();
        },
        signOut() {
            logoutUser()
            this.userStore.isLoggedIn = false;
            if (this.$route.meta.requiresAuth) this.$router.push({ name: 'home' })
        },
        changeLocaleEN() {
            this.$i18n.locale = 'en'
        },
        changeLocaleNL() {
            this.$i18n.locale = 'nl'
        }
    }
}


</script>