<script setup>
import { ref, watch } from 'vue';
import { fa } from 'vuetify/lib/locale/index.mjs';
const model = ref(0);
const videoPlayer = ref(null);
const playCycle = ref(true)

watch(model, (newModel) => {
  const video = videoPlayer.value;
  if (newModel === 0) {
    video.play();
    playCycle.value = false
  } else {
    video.pause();
    playCycle.value = true
  }
})
const videoPlaying = () => {
  playCycle.value = false;
}

const videoPause = () => {
  playCycle.value = true;
}

const videoEnd = () => {
  model.value = 1;
}
</script>
<template>
  <v-carousel width="80vw" height="95vh" v-model="model" show-arrows="hover" :cycle="playCycle">
    <v-carousel-item>
      <video ref="videoPlayer" width="100%" height="100%" style="object-fit: cover;" controls autoplay
        src="../../../public/assets/img/product/vedio.mp4"
        poster="../../../public/assets/img/product/istockphoto-1176577279-1024x1024.jpg" @play="videoPlaying"
        @pause="videoPause" @ended="videoEnd">
      </video>
    </v-carousel-item>
    <v-carousel-item src="../../../public/assets/img/product/istockphoto-1160270992-1024x1024.jpg"
      cover></v-carousel-item>

    <v-carousel-item src="../../../public/assets/img/product/yakitori_1853229820.jpg" cover></v-carousel-item>

    <v-carousel-item src="../../../public/assets/img/product/istockphoto-1281978619-1024x1024.jpg"
      cover></v-carousel-item>
    <v-carousel-item src="../../../public/assets/img/product/istockphoto-1327402628-1024x1024.jpg"
      cover></v-carousel-item>

    <v-carousel-item src="../../../public/assets/img/product/istockphoto-1494293720-1024x1024.jpg"
      cover></v-carousel-item>
    <v-carousel-item src="../../../public/assets/img/product/istockphoto-908941164-1024x1024.jpg"
      cover></v-carousel-item>
  </v-carousel>
</template>

<style scoped>
.full-video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>