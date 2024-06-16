<script setup>
const props = defineProps({
    images: {
        type: Array,
        required: true
    }
})
</script>

<template>
    <v-carousel show-arrows="hover" cycle height="875" interval="3000">
        <v-carousel-item v-for="image in props.images" :key="image.id" :src="image.src" cover></v-carousel-item>
    </v-carousel>
</template>
