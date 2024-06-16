<template>
      <v-col>
            <v-dialog activator="parent" max-width="100vw" max-height="80vh" width="50%" height="50%">
                  <template v-slot:activator="{ props: activatorProps }">
                        <v-card class="mx-auto" id="reverseColor" width="30%" min-width="300px" height="100%">
                              <v-img height="300px" :src="imageUrl" cover class="ma-3">
                                    <v-card width="20%" color="transparent">
                                          <v-img
                                                src="https://lh3.googleusercontent.com/d/1r9mZptca9wF2QtnacrmNxAUKuHwQyvPr"><v-card-title
                                                      class="text-black text-center text-red text-body-1">{{
                        rank
                  }}</v-card-title>
                                          </v-img>
                                    </v-card>
                              </v-img>
                              <v-card-text class="d-flex justify-space-evenly text-h4 pa-2" id="reverseColor">{{
                              productName
                        }}</v-card-text>
                              <v-card-text class="d-flex justify-space-evenly text-h5">
                                    <slot name="textName"></slot>
                                    <v-sheet id="reverseColor">銷售數量: {{ totalCount }}</v-sheet>
                              </v-card-text>
                        </v-card>
                  </template>
                  <template v-slot:default="{ isActive }">
                        <Horizantal :image-url="props.imageUrl" :name="props.productName" :unit-price="props.unitPrice"
                              :present="props.present"></Horizantal>
                  </template>
            </v-dialog>
      </v-col>
</template>
<script setup>
import { ref } from 'vue'
import Horizantal from '../Menu/CardHorizantal.vue';
const dialog = ref(false);
const props = defineProps({
      imageUrl: String,
      productName: String,
      totalCount: Number,
      rank: Number,
      unitPrice: Number,
      present: String,
})
</script>
<style scoped>
#reverseColor {
      color: white;
      background-color: black;
}
</style>