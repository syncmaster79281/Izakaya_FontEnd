<template>
  <div class="video-container mx-auto">
    <video autoplay loop muted>
      <source :src="videoSource" type="video/mp4">
      <!-- 添加其他视频格式的 source 标签，以提高兼容性 -->
    </video>
    <h1>{{ overlayText }}</h1>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const overlayText = ref('查看我們的最新活動');
const videoSource = ref("https://www.shutterstock.com/shutterstock/videos/1022981305/preview/stock-footage-slow-motion-close-up-of-happy-young-friends-having-fun-together-drinking-beer-and-clinking-glasses.webm")

</script>

<style scoped>
.video-container {
  width: 50%;
  height: 50vh;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  & video {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
  }

  & h1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 40px;
    text-align: center;
    line-height: 50vh;
    color: white;
    text-transform: uppercase;
    mix-blend-mode: screen;
  }
}
</style>