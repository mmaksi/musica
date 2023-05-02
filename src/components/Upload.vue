<template>
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
            <!-- Upload Dropbox -->
            <!-- v-bind directive is used to render componet's state inside html attributes -->
            <div :class="{ 'bg-green-400 border-green-400 bg-solid': is_dragover }"
                class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
                @drag.prevent.stop="" @dragstart.prevent.stop="" @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true" @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false" @drop.prevent.stop="upload($event)">
                <h5>Drop your files here</h5>
            </div>
            <input type="file" multiple @change="upload" />
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
                <!-- File Name -->
                <div class="font-bold text-sm" :class="upload.text_class">
                    <i :class="upload.icon"> </i> {{ upload.name }}
                </div>
                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <!-- Inner Progress Bar -->
                    <div class="transition-all progress-bar" :class="upload.variant"
                        :style="{ width: upload.current_progress + '%' }">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { uploadToFirebase, storeSongWithUser, cancelUpload } from "../includes/firebase"

export default {
    name: "Upload",
    data() {
        return {
            is_dragover: false,
            uploads: [],
        }
    },
    props: {
        addSongToArray: {
            type: Function,
            required: true,
        }
    },
    methods: {
        upload($event) {
            this.is_dragover = false;
            const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];
            // Upload only mp3 files
            files.forEach(file => {
                if (file.type !== 'audio/mpeg') {
                    return;
                }
                const task = uploadToFirebase(file)
                const songData = {
                    task,
                    current_progress: 0,
                    name: file.name,
                    variant: 'bg-blue-400',
                    icon: 'fas fa-spinner fa-spin',
                    text_class: ''
                }
                const uploadIndex = this.uploads.push(songData) - 1
                task.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        this.uploads[uploadIndex].current_progress = progress
                    },
                    (error) => {
                        // Error
                        this.uploads[uploadIndex].variant = 'bg-red-400'
                        this.uploads[uploadIndex].icon = 'fas fa-times'
                        this.uploads[uploadIndex].text_class = 'text-red-400'
                        throw new Error(error)
                    },
                    async () => {
                        const song = await storeSongWithUser(task)
                        // Success
                        this.uploads[uploadIndex].variant = 'bg-green-400'
                        this.uploads[uploadIndex].icon = 'fas fa-check'
                        this.uploads[uploadIndex].text_class = 'text-green-400'
                        this.addSongToArray(song)
                    }
                )
            });
        }
    },
    beforeUnmount() {
        const songs = this.uploads
        cancelUpload(songs)
    }
}
</script>