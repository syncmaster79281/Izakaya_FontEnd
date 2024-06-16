<template>
      <v-row class="d-flex justify-center" width="70%">
            <v-card class="d-flex flex-no-wrap">
                  <v-col cols="7">
                        <v-avatar rounded="0" size="100%">
                              <v-img :src="imageUrl" min-width="600" max-height="100vh" cover>
                              </v-img>
                        </v-avatar>
                  </v-col>
                  <v-col cols="5" class="d-flex flex-column text-left">
                        <v-card-title class="text-h5 my-5 py-0">{{ name }}</v-card-title>
                        <divider></divider>
                        <v-card-title class="text-h5 my-5 py-0">$ {{ unitPrice }}</v-card-title>
                        <divider></divider>
                        <v-card-text class="text-h5 text-wrap " style="line-height: 1.5">
                              {{ present }}
                        </v-card-text>
                        <divider></divider>
                  </v-col>
            </v-card>
      </v-row>
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