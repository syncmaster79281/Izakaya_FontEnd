<template>
  <v-row :style="cardStyle">
    {{ ccc }}
    <v-col cols="12" sm="6" md="6" lg="4" xl="3" class="pa-6" v-for="product in productList">
      <v-dialog activator="parent" max-width="100vw" max-height="80vh" width="50%" height="50%"
        :transition="product.id % 2 == 0 ? 'dialog-bottom-transition' : 'dialog-top-transition'"
        v-model="product.dialog" :key="product.id">
        <template v-slot:activator="{ props: activatorProps }">
          <v-hover v-slot="{ isHovering, props }">
            <v-card class="rounded-xl" :elevation="isHovering ? 24 : 6" v-bind:="props">
              <v-img v-bind="activatorProps" :src="product.imageUrl" height="400" min-height="100%" aspect-ratio="4/3"
                cover>
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
              <v-card-title class="text-h4 ma-3"> {{ product.name }} </v-card-title>
              <v-card-text class="text-h5 ma-3">
                $ {{ product.unitPrice }}
              </v-card-text>
            </v-card>
          </v-hover>
        </template>
        <template v-if="showDialog" v-slot:default="{ isActive }">
          <!-- <v-btn icon="mdi-close" @click="product.dialog = false"></v-btn> -->
          <Horizantal v-bind="product"></Horizantal>
        </template>
        <template v-else v-slot:default="{ isActive }">
          <ProductCard v-bind="product"></ProductCard>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue'
import Horizantal from './CardHorizantal.vue'
import ProductCard from './ProductCard.vue';
import { useDisplay } from "vuetify";
const props = defineProps({
  productList: Array,
  cardStyle: Object,
})
const { width, mobile } = useDisplay();


const showDialog = ref(true);

const ccc = computed(() => {
  showDialog.value = width.value > 1280;
  // console.log(`寬度: ${width.value}`);
  // console.log(`是否為手機板: ${mobile.value}`);
})

</script>