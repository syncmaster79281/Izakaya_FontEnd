<template>
  <a-result status="404" title="404" sub-title="抱歉，該頁面不存在!!">
    <template #extra>
      <a-button type="primary" @click="GoHomePage">回首頁</a-button>
    </template>
  </a-result>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const GoHomePage = () => {
  router.push('/');
};

onMounted(() => {
  document.body.style.backgroundColor = 'white';
});

onUnmounted(() => {
  document.body.style.backgroundColor = '#0c0b09';
});
</script>
