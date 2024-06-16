<script setup>

import { onMounted } from 'vue';

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

//倒計時
import { useCountDown } from '@/composables/useCountDown';
const { formatTime, start, percentage } = useCountDown();


// 確認付款
function confirmPayment() {
  confirmApi();
}

import { usePaymentStore } from '@/stores/paymentStore';
import { storeToRefs } from 'pinia';

const store = usePaymentStore();
const { paymentConfirmDto, orderDetail, bestDiscount } = storeToRefs(store);

import { LinePayConfirmApi, updateOrderStatusApi, deleteRewardApi } from '@/apis/pay';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

//刪除優惠卷
const deleteReward = async () => {
  try {
    const res = await deleteRewardApi(bestDiscount.value.id);
  } catch (error) {
    message.error({
      content: error.message,
      key: 'deleteReward',
      duration: 2,
    });
  }
}

const confirmApi = async () => {
  try {
    const requestData = {
      transactionId: route.query.transactionId,
      orderId: route.query.orderId,
      paymentConfirmDto: paymentConfirmDto.value,
    };
    const res = await LinePayConfirmApi(requestData);
    if (res.returnCode !== '0000') {
      throw new Error(res.returnMessage);
    }
    const orderPaymentDto = {
      combinedOrderId: route.query.orderId,
      netAmount: paymentConfirmDto.value.amount,
      paymentStatusId: 2,
      paymentTime: dayjs().format(),
    }
    const response = await updateOrderStatusApi(orderPaymentDto);
    if (response === '修改訂單成功') {
      deleteReward();
      store.clearData();
    }
    router.push(`/checkout/finish?orderId=${route.query.orderId}`);
  } catch (error) {
    message.error({
      content: error.message,
      key: 'ConfirmApi',
      duration: 2,
    });
    router.push(`/checkout/finish?orderId=${route.query.orderId}`);
  }
}

onMounted(() => {
  start(300);
});

</script>

<template>
  <v-container class="container-height  d-flex justify-center align-center pa-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="9" md="5" lg="5">
        <v-card class="rounded-lg overflow-hidden" dark color="grey-darken-4" elevation="12">
          <v-img src="/assets/img/linePay/confirmPay.png" cover aspect-ratio="1.5" class="rounded-top pa-4"
            max-height="400">
          </v-img>
          <v-card-title class="text-h5 justify-center py-4">訂單確認</v-card-title>
          <v-card-text>
            <div>
              <div class="my-2"><strong>總金額:</strong> {{ paymentConfirmDto.amount }} {{ paymentConfirmDto.currency }}
              </div>
              <div class="my-2"><strong>確認付款:</strong>
                <v-progress-circular :model-value="percentage" :rotate="360" :width="3" color="yellow-accent-2">
                  <template v-slot:default><span class="progress-text">{{ percentage }} %</span></template>
                </v-progress-circular>
              </div>
              <div class="my-2"><strong>剩餘時間:</strong> {{ formatTime }}，超時後將自動取消</div>
            </div>
          </v-card-text>
          <v-card-actions class="justify-center py-4">
            <v-btn color="green-accent-3" class="rounded-lg" dark large variant="outlined"
              @click="confirmPayment">確認付款</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.container-height {
  min-height: 100vh;
  background-color: #534f4f;
}

.v-progress-circular {
  margin: 1rem;
}

.progress-text {
  font-size: 9px;
  animation: blink-animation 2.5s infinite;
}

@keyframes blink-animation {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>