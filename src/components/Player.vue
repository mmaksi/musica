<template>
    <!-- Player -->
    <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
        <!-- Track Info -->
        <div class="text-center" v-if="currentSong.modifiedName">
            <span class="song-title font-bold">{{ currentSong.modifiedName }}</span> by
            <span class="song-artist">{{ currentSong.displayName }}</span>
        </div>
        <div class="flex flex-nowrap gap-4 items-center">
            <!-- Play/Pause Button -->
            <button type="button" @click.prevent="toggleAudio">
                <!-- In Vue templates, JavaScript expressions can be used in directives values as well as {{ mustaches }} -->
                <i class="fa text-gray-500 text-xl" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
            </button>
            <!-- Current Position -->
            <div class="player-currenttime">{{ seek }}</div>
            <!-- Scrub Container  -->
            <div class="w-full h-2 rounded bg-gray-200 relative cursor-pointer">
                <!-- Player Ball -->
                <span class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg" :style="{ left: playerProgress }">
                    <i class="fas fa-circle"></i>
                </span>
                <!-- Player Progress Bar-->
                <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
                    :style="{ width: playerProgress }"></span>
            </div>
            <!-- Duration -->
            <div class="player-duration">{{ duration }}</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "pinia"
import { usePlayerStore } from "@/stores/player"

export default {
    name: "Player",
    methods: {
        ...mapActions(usePlayerStore, ['toggleAudio'])
    },
    computed: {
        ...mapState(usePlayerStore, ['playing', 'seek', 'duration', 'playerProgress', 'currentSong'])
    }
}

</script>
