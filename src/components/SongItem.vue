<template>
    <li class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50">
        <div>
            <RouterLink :to="{ name: 'song', params: { id: song.docID } }" class="font-bold block text-gray-600">{{
                song.modifiedName }}</RouterLink>
            <span class="text-gray-500 text-sm">{{ song.displayName }}</span>
        </div>

        <div class="text-gray-600 text-lg">
            <RouterLink v-slot="{ navigate }" custom :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }">
                <span class="comments" @click="navigate">
                    <i class="fa fa-comments text-gray-600"></i>
                    {{ song.commentCount }}
                </span>
            </RouterLink>
        </div>
    </li>
</template>

<script>
export default {
    props: ['song']
}
</script>
