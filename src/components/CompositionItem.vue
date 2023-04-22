<template>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <div v-show="showForm === false">
            <h4 class="inline-block text-2xl font-bold">Song Name</h4>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
                <i class="fa fa-times"></i>
            </button>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right" @click="showForm = !showForm">
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
        <div v-show="showForm === true">
            <VeeForm :validation-schema="songSchema" @submit="editSong" :initial-values="song">
                <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <VeeField name="modifiedName" type="text"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title" />
                    <ErrorMessage class="text-red-600" name="modifiedName" />
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <VeeField name="songGenre" type="text"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre" />
                </div>
                <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">
                    Submit
                </button>
                <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600">
                    Go Back
                </button>
            </VeeForm>
        </div>
    </div>
</template>

<script>

export default {
    name: "CompositionItem",
    data() {
        return {
            showForm: false,
            songSchema: {
                songTitle: 'required'
            },
        }
    },
    props: {
        song: {
            type: Object,
            required: true
        }
    },
    methods: {
        editSong() {

        }
    },
    created() {
        console.log(this.song)
    }
}
</script>