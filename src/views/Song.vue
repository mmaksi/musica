<template>
    <div>
        <!-- Music Header -->
        <section class="w-full mb-8 py-14 text-center text-white relative">
            <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
                style="background-image: url(/assets/img/song-header.png)"></div>
            <div class="container mx-auto flex items-center">
                <!-- Play/Pause Button -->
                <button @click.prevent="playClickHandler" type="button"
                    class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
                    <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
                </button>
                <div class="z-50 text-left ml-8">
                    <!-- Song Info -->
                    <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
                    <div>{{ song.modifiedName }}</div>
                </div>
            </div>
        </section>
        <!-- Form -->
        <section class="container mx-auto mt-6" id="comments">
            <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                    <!-- Comment Count -->
                    <span class="card-title">{{ `Comments (${song.commentCount})` }}</span>
                    <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
                </div>
                <div class="p-6">
                    <div class="text-white text-center font-bold p-4 mb-4" v-if="comment_show_alert"
                        :class="comment_alert_variant">
                        {{ comment_alert_message }}
                    </div>
                    <VeeForm :validation-schema="songSchema" @submit="submitComment" v-if="isLoggedIn">
                        <VeeField as="textarea" name="comment"
                            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                            placeholder="Your comment here...">
                        </VeeField>
                        <ErrorMessage class="text-red-600" name="comment" />
                        <button :disabled="comment_in_submission" type="submit"
                            class="py-1.5 px-3 rounded text-white bg-green-600 block">
                            Submit
                        </button>
                    </VeeForm>
                    <!-- Sort Comments -->
                    <select v-model="sort"
                        class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
                        <option value="1">Latest</option>
                        <option value="2">Oldest</option>
                    </select>
                </div>
            </div>
        </section>
        <!-- Comments -->
        <ul class="container mx-auto">
            <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments" :key="comment.docID">
                <!-- Comment Author -->
                <div class="mb-5">
                    <div class="font-bold">{{ comment.name }}</div>
                    <time>{{ comment.datePosted }}</time>
                </div>

                <p>
                    {{ comment.content }}
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
import { getSongByDocID, addComment, getAllComments } from "@/includes/firebase"
import { mapState, mapActions } from "pinia"
import { useUserStore } from "@/stores/user"
import { usePlayerStore } from "@/stores/player"

export default {
    name: 'Song',
    computed: {
        // To toggle form visibility based on logged-in state
        ...mapState(useUserStore, ['isLoggedIn']),
        ...mapState(usePlayerStore, ['playing']),
        sortedComments() {
            return this.comments.slice().sort((a, b) => {
                if (this.sort === "1")
                    return new Date(b.datePosted) - new Date(a.datePosted);
                return new Date(a.datePosted) - new Date(b.datePosted);
            });
        },
    },
    data() {
        return {
            song: { modifiedName: '', genre: '', commentCount: 0 },
            songSchema: {
                comment: 'required|min:3'
            },
            comment_in_submission: false,
            comment_show_alert: false,
            comment_alert_variant: "bg-blue-500",
            comment_alert_message: "Please wait! Your comment is being submitted",
            comments: [],
            sort: '1' // Latest to oldest sort
        }
    },
    methods: {
        ...mapActions(usePlayerStore, ['newSong']),
        ...mapActions(usePlayerStore, ['toggleAudio']),
        async submitComment(values, { resetForm }) {
            this.comment_in_submission = true;
            this.comment_show_alert = true;
            this.comment_alert_variant = "bg-blue-500";
            this.comment_alert_message =
                "Please wait! Your comment is being submitted";

            const comment = await addComment(values, this.$route.params.id, this.song.commentCount + 1)
            this.song.commentCount += 1;
            if (comment.uid) this.getComments(this.$route.params.id, this.comments)

            this.comment_in_submission = false;
            this.comment_alert_variant = "bg-green-500";
            this.comment_alert_message = "Comment added!";

            setTimeout(() => {
                this.comment_show_alert = false;
            }, 1000);

            resetForm();
        },
        async getComments(songID, comments) {
            await getAllComments(songID, comments)
        },
        playClickHandler() {
            this.newSong(this.song)
        }
    },
    async created() {
        const song = await getSongByDocID(this.$route.params.id)
        if (!song) {
            this.$router.push({ name: 'home' })
            return
        }
        // check if the url has the sort parameter set
        const { sort } = this.$route.query;
        this.sort = sort === "1" || sort === "2" ? sort : "1";
        // Update the song data property
        this.song = song
        const songID = this.$route.params.id
        // Update the comments local state with all comments from firestore
        this.getComments(songID, this.comments)
    },
    watch: {
        // Watch any changes to the 'sort' data property and update the url with sort value
        sort(newVal) {
            // Prevents the watcher from updating the route if the query parameter already matches the sort value
            if (newVal === this.$route.query.sort) {
                return;
            }
            this.$router.push({
                query: {
                    sort: newVal,
                },
            });
        },
    },
}
</script>
