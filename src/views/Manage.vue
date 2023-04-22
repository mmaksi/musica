<template>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
        <div class="md:grid md:grid-cols-3 md:gap-4">
            <div class="col-span-1">
                <AppUpload :addSongToArray="addSongToArray" />
            </div>
            <div class="col-span-2">
                <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                        <span class="card-title">My Songs</span>
                        <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
                    </div>
                    <div class="p-6">
                        <!-- Composition Items -->
                        <CompositionItem v-for="(song, index) in songs" :updateSongData="updateSongData"
                            :removeSong="removeSong" :index="index" :key="song" :song="song" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import AppUpload from "@/components/Upload.vue"
import { getUserSongs } from "@/includes/firebase"
import CompositionItem from "@/components/CompositionItem.vue"

export default {
    name: 'Manage',
    data() {
        return {
            songs: []
        }
    },
    components: {
        AppUpload,
        CompositionItem
    },
    methods: {
        updateSongData(i, values) {
            this.songs[i].modifiedName = values.modifiedName
            this.songs[i].genre = values.genre
        },
        removeSong(i) {
            this.songs.splice(i, 1)
        },
        addSongToArray(song) {
            this.songs.push(song)
        }
    },
    // Query the database for songs of the logged-in user when mounting the Manage component
    async created() {
        const snapshot = await getUserSongs()
        // Store the queried songs in a local state
        snapshot.forEach((document) => {
            const song = {
                ...document.data(),
                docID: document.id
            }
            this.songs.push(song)
        })
    }
}
</script>