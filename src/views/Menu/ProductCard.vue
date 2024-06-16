<template>
      <v-card class="text-center" height="150vh" max-width="80vw">
            <v-card-title class="text-h5 my-5 py-0 ">{{ name }}</v-card-title>
            <divider></divider>
            <v-card-title class="text-h5 my-5 py-0 ">$ {{ unitPrice }}</v-card-title>
            <divider></divider>
            <v-card-text v-if="present.length > 50" class="text-h6 text-wrap" style="line-height: 1.5">
                  {{ present }}
            </v-card-text>
            <v-card-text v-else class="text-h5 text-wrap" style="line-height: 1.5">
                  {{ present }}
            </v-card-text>
            <divider></divider>
      </v-card>
</template>
<script setup>
import divider from './divider.vue';
const props = defineProps({
      name: String,
      present: String,
      unitPrice: Number,
      imageUrl: String,
})
</script>