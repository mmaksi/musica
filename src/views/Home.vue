<template>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
        <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
            style="background-image: url(assets/img/header.png)"></div>
        <div class="container mx-auto">
            <div class="text-white main-header-content">
                <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
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
    <section class="container mx-auto">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                <span class="card-title">Songs</span>
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

    <!-- Player -->
    <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
        <!-- Track Info -->
        <div class="text-center">
            <span class="song-title font-bold">Song Title</span> by
            <span class="song-artist">Artist</span>
        </div>
        <div class="flex flex-nowrap gap-4 items-center">
            <!-- Play/Pause Button -->
            <button type="button">
                <i class="fa fa-play text-gray-500 text-xl"></i>
            </button>
            <!-- Current Position -->
            <div class="player-currenttime">00:00</div>
            <!-- Scrub Container  -->
            <div class="w-full h-2 rounded bg-gray-200 relative cursor-pointer">
                <!-- Player Ball -->
                <span class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg" style="left: 50%">
                    <i class="fas fa-circle"></i>
                </span>
                <!-- Player Progress Bar-->
                <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400" style="width: 50%"></span>
            </div>
            <!-- Duration -->
            <div class="player-duration">03:06</div>
        </div>
    </div>
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
            console.log(this.songs)
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