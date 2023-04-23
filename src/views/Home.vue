<template>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
        <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
            style="background-image: url(assets/img/header.png)"></div>
        <div class="container mx-auto">
            <div class="text-white main-header-content">
                <h1 class="font-bold text-5xl mb-5">{{ $t("home.listen") }}</h1>
                <p class="w-full md:w-8/12 mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                    et dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
                    suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
                    pulvinar, fringilla lorem eget, ullamcorper urna.
                </p>
            </div>
        </div>

        <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full" src="/assets/img/introduction-music.png" />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto mb-14">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                <span class="card-title">{{ $t('manage.songs') }}</span>
                <!-- Icon -->
                <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
            </div>
            <!-- Playlist -->
            <ol id="playlist">
                <SongItem v-for="song in songs" :song="song" :key="song.docID" />
            </ol>
            <!-- .. end Playlist -->
        </div>
    </section>
</template>

<script>
import { getAllSongs } from "@/includes/firebase"
import SongItem from "@/components/SongItem.vue"

export default {
    data() {
        return {
            songs: [],
            maxPerPage: 3,
            pendingRequest: false,
        }
    },
    methods: {
        handleScroll() {
            const { scrollTop, offsetHeight } = document.documentElement;
            const { innerHeight } = window;
            // Alternative (less strict)
            // const bottomOfWindow =
            //   Math.round(scrollTop) + innerHeight > offsetHeight - 100;
            const bottomOfWindow =
                Math.round(scrollTop) + innerHeight === offsetHeight;

            if (bottomOfWindow) {
                this.getSongs(this.songs, this.maxPerPage);
            }
        },
        async getSongs() {
            if (this.pendingRequest) {
                return
            }
            // Prevent multiple requests
            this.pendingRequest = true
            const allSongs = await getAllSongs(this.songs, this.maxPerPage)
            this.songs = [...this.songs, ...allSongs]
            this.pendingRequest = false
        }
    },
    components: {
        SongItem
    },
    async created() {
        this.getSongs()
        window.addEventListener("scroll", this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    },
}
</script>