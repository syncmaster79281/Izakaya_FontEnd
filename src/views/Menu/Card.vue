<template>
      <div class="text-h3 ma-10">
            <slot name="titleName"></slot>
      </div>
      <v-row class="ma-6">
            <template v-for="(item, index) in items">
                  <v-col :cols="nums">
                        <v-card class="mx-auto mb-3" max-width="344">
                              <v-img height="200px" :src="item.imgUrl" cover class="mb-3"></v-img>

                              <!-- <v-card-title class="text-center">
                                    <slot name="titleName"></slot>
                              </v-card-title> -->
                              <v-card-subtitle class="d-flex justify-space-evenly text-h4 pa-2"><v-sheet>NO.{{ index + 1
                                          }}</v-sheet><v-sheet>
                                          {{ item.productName }}</v-sheet></v-card-subtitle>
                              <v-card-text class="d-flex justify-space-evenly text-h5">
                                    <slot name="textName"></slot>
                                    <v-sheet> {{ item.totalCount }}</v-sheet>
                              </v-card-text>
                              <v-card-subtitle v-if="showStar" class="d-flex justify-space-evenly text-h5 pa-3">
                                    <slot name="starName"></slot>
                                    <v-rating v-model="item.rating" active-color="yellow-accent-4" color="white"
                                          size="18" half-increments class="mt-n3 ms-n5" :readonly="true"></v-rating>
                              </v-card-subtitle>
                        </v-card>
                  </v-col>
            </template>
      </v-row>
</template>
<script setup>
const props = defineProps({
      items: Array,
      showStar: Boolean,
      nums: Number
})
</script>