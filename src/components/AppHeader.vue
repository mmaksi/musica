<template>
    <!-- Header -->
    <header id="header" class="bg-gray-700">
        <nav class="container mx-auto flex justify-start items-center py-5 px-4">
            <!-- App Name -->
            <a class="text-white font-bold uppercase text-2xl mr-4" href="#">Music</a>

            <div class="flex flex-grow items-center">
                <!-- Primary Navigation -->
                <ul class="flex flex-row mt-1">
                    <!-- Navigation Links -->
                    <li v-if="!userStore.isLoggedIn">
                        <a class="px-2 text-white" href="#" @click="toggleAuthModal">Login
                            /
                            Register</a>
                    </li>
                    <template v-else>
                        <li>
                            <a class="px-2 text-white" href="#">Manage</a>
                        </li>
                        <li>
                            <a class="px-2 text-white" href="#" @click.prevent="signOut">Logout</a>
                        </li>
                    </template>
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
        ...mapStores(useUserStore)
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
        }
    }
}


</script>