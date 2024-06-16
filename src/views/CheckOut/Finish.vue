<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { getOrderApi } from '@/apis/pay';

const router = useRouter();
const route = useRoute();
const orderInfo = ref({});

const isSuccess = computed(() => {
  return orderInfo.value.paymentStatus === "付款成功";
});

const navigate = (path) => {
  router.push(path);
};
import { message } from 'ant-design-vue';

const getOrderInfo = async () => {
  try {
    const res = await getOrderApi(route.query.orderId);
    orderInfo.value = res;
  } catch (error) {
    message.error({
      content: error.message,
      key: 'GetOrderInfo',
      duration: 2,
    });
  }
};

onMounted(() => {
  getOrderInfo();
});
</script>

<template>
  <v-container fluid class="d-flex justify-center align-center mx-auto container-height">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="text-center pa-5 rounded-lg card-animation" elevation="12">
          <v-icon class="icon-bounce" size="120" :color="isSuccess ? 'green' : 'red'">
            {{ isSuccess ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
          </v-icon>
          <v-card-title class="justify-center py-4 text-h4">
            {{ isSuccess ? '付款成功' : '付款失敗' }}
          </v-card-title>
          <v-card-text>
            <div class="subtitle-1 text-h6">
              <div v-if="isSuccess">訂單編號: {{ orderInfo.combinedOrderId }}，付款金額: {{ orderInfo.netAmount?.toFixed(0) }}
              </div>
              <div v-else>訂單編號: {{ orderInfo.combinedOrderId }}，交易失敗</div>
            </div>
          </v-card-text>
          <v-card-actions class="justify-center py-4">
            <template v-if="isSuccess">
              <v-btn color="deep-purple-accent-4" size="large"
                @click="() => navigate(`/questionnaire/${route.query.orderId}`)" class="btn-style">
                <v-icon left>mdi-shape-square-rounded-plus</v-icon>
                問卷調查
              </v-btn>
            </template>
            <template v-else>
              <v-btn color="green-accent-4" size="large" @click="() => navigate('/checkout')" class="btn-style">
                <v-icon left>mdi-history</v-icon>
                回歷史訂單
              </v-btn>
              <v-btn color="deep-purple-accent-4" size="large" @click="() => navigate('/')" class="btn-style">
                <v-icon left>mdi-home</v-icon>
                回首頁
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.container-height {
  min-height: 100vh;
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
}

.card-animation {
  transition: transform 0.5s ease;
}

.card-animation:hover {
  transform: translateY(-10px);
}

.icon-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-30px);
  }

  60% {
    transform: translateY(-15px);
  }
}
</style>