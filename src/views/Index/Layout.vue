<script setup>
import Header from "@/views/Index/Header.vue";
import Footer from "@/views/Index/Footer.vue";
</script>

<template>
  <Header />
  <v-container class="pa-8"></v-container>
  <RouterView />
  <Footer />
</template>
