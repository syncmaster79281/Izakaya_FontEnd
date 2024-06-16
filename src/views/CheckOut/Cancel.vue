<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();


function goBack() {
  router.push('/checkout');
}
</script>

<template>
  <v-container fluid class="d-flex justify-center align-center container-height">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="9">
        <v-card class="text-center pa-5 rounded-lg" color="#FFFFFF" elevation="12">
          <v-img src="/assets/img/linePay/cancelPay.png" cover class="mb-4" height="300"></v-img>
          <v-card-text class="subtitle-1 pb-3">您的交易已成功取消。</v-card-text>
          <v-btn color="red-accent-3" dark @click="goBack">返回</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.container-height {
  min-height: 100vh;
  background-color: #ECEFF1;
}
</style>