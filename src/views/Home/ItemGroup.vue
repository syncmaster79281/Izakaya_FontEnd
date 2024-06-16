<script setup>
import { defineModel, onMounted, onUnmounted } from 'vue'


const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const model = defineModel('model');


onMounted(() => {
  let currentIndex = 0;
  const intervalId = setInterval(() => {
    model.value = props.items[currentIndex].id;
    currentIndex = (currentIndex + 1) % props.items.length;
  }, 2000);
  onUnmounted(() => {
    clearInterval(intervalId);
  });
})


</script>

<template>
  <v-sheet class="mx-auto" dark color="#0c0b09">
    <div class="text-h4 text-white" dark>
      <slot name="name"></slot>
    </div>
    <v-slide-group v-model="model" class="pa-0" center-active show-arrows>
      <v-slide-group-item v-for="item in props.items" :key="item.id" v-slot="{ isSelected, toggle }">
        <v-card :color="isSelected ? 'primary' : 'grey-lighten-1'" class="ma-4" height="300" width="300"
          @click="toggle">
          <div class="d-flex fill-height align-center justify-center">
            <v-scale-transition>
              <v-img :src="item.src" class="text-right ma-4" height="300" width="300" cover>
                <v-btn dark class="text-pink" color="transparent" icon size="x-large">
                  <v-icon>{{ isSelected ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                </v-btn>
              </v-img>
            </v-scale-transition>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>