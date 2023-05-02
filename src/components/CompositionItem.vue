<template>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <div v-show="showForm === false">
            <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right" @click.prevent="removeSongDB">
                <i class="fa fa-times"></i>
            </button>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click.prevent="showForm = !showForm">
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
        <div v-show="showForm === true">
            <div class="text-white text-center font-bold p-4 mb-4" v-if="showAlert" :class="alertVariant">{{ alertMessage }}
            </div>
            <VeeForm v-bind="veeFormAttrs" @submit="editSong">
                <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <VeeField name="modifiedName" type="text"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title" @input="updateUnsavedFlag(true)" />
                    <ErrorMessage class="text-red-600" name="modifiedName" />
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <VeeField name="genre" type="text"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre" @input="updateUnsavedFlag(true)" />
                </div>
                <!-- v-bind:disabled is a Boolean Attribute -->
                <button :disabled="inSubmission" type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">
                    Submit
                </button>
                <button @click.prevent="showForm = false" :disabled="inSubmission" type="button"
                    class="py-1.5 px-3 mx-3 rounded text-white bg-gray-600">
                    Cancel
                </button>
            </VeeForm>
        </div>
    </div>
</template>

<script>
import { editSongData, deleteSong } from "@/includes/firebase"

export default {
    name: "CompositionItem",
    data() {
        return {
            veeFormAttrs: {
                validationSchema: {
                    modifiedName: 'required'
                },
                initialValues: this.song
            },
            showForm: false,
            songSchema: {
                modifiedName: 'required'
            },
            inSubmission: false,
            showAlert: false,
            alertVariant: 'bg-blue-500',
            alertMessage: 'Please wait! Updating song info.'
        }
    },
    props: {
        song: {
            type: Object,
            required: true
        },
        updateSongData: {
            type: Function,
            required: true
        },
        removeSong: {
            type: Function,
            required: true
        },
        updateUnsavedFlag: {
            type: Function,
        },
        index: {
            type: Number,
            required: true
        },
    },
    methods: {
        async editSong(values) {
            // While submitting...
            this.inSubmission = true;
            this.showAlert = true;
            this.alertVariant = 'bg-blue-500';
            this.alertMessage = 'Please wait! Updating song info.'
            // After submitting...
            try {
                // Success
                await editSongData(this.song.docID, values)
                this.inSubmission = false;
                this.alertVariant = 'bg-green-500';
                this.alertMessage = 'Updated successfully!'
                this.updateSongData(this.index, values)
                setTimeout(() => {
                    this.showAlert = true;
                    this.showForm = false
                }, 1000);
            } catch (error) {
                // Fail
                this.inSubmission = false;
                this.alertVariant = 'bg-red-500';
                this.alertMessage = 'Something went wrong. Try again later.'
                console.log(error)
                setTimeout(() => {
                    this.showAlert = true;
                }, 1000);
            }
            this.updateUnsavedFlag(false)
        },
        async removeSongDB() {
            await deleteSong(this.song.docID, this.song.originalName)
            this.removeSong(this.index)
        }
    }
}
</script>