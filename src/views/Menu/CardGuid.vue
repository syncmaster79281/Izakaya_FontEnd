<template>
  <v-container fluid class="pa-0 container-bg" style="background-color: black;">
    <div class="text-h4 text-white pa-5">
      <slot name="name"></slot>
    </div>
    <div class="d-flex justify-center align-center mx-auto" style="width: 70%;">
      <v-row justify="center">
        <template v-if="false">
          breakpoint.IN.Sm
        </template>
        <template v-else>
          <v-col cols="12" sm="6" lg="4" xl="3" v-for="category in categoryList">
            <div @click="categoryClick(category.id)">
              <v-card class="mx-auto" height="100%" style="position: relative" flat color="black">
                <v-responsive aspect-ratio="1">
                  <v-img :src="category.url" height="100%" width="100%" style="object-fit:">
                    <template v-slot:error>
                      <v-img class="mx-auto" height="300" max-width="500"
                        src="https://picsum.photos/500/300?image=232"></v-img></template>
                  </v-img>
                  <div class="d-flex align-center justify-center" style="
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                    ">
                    <span style="
                        text-shadow: 2px 2px 4px blue;
                        color: orange;
                        font-size: 5vmin
                      ">{{ category.name }}</span>
                  </div>
                </v-responsive>
              </v-card>
            </div>
          </v-col>
        </template>

      </v-row>
    </div>
  </v-container>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
  categoryList: Array,
})

const categoryClick = (categoryId) => {
  router.push({
    name: 'menu',
    params: { id: categoryId },
  });
}
</script>


<style scoped>
.container-bg {
  background-color: #0c0b09;
}
</style>