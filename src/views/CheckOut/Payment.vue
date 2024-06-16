<script setup>

import { ref, onMounted, computed } from 'vue';

//會員資料
import { useUserStore } from '@/stores/user.js'
import { storeToRefs } from 'pinia';
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

//取的會員ID
const memberId = computed(() => {
  return userInfo.value.userId;
});

//引入API
import { getMemberPaymentApi } from '@/apis/pay.js'

//引入時間插件
import dayjs from 'dayjs';
// 訂單數據
const orders = ref([]);
import { message } from 'ant-design-vue';
//取的行動支付未付款清單
const getPaymentList = async () => {
  try {
    const res = await getMemberPaymentApi(memberId.value);
    // 轉換數據
    res.forEach(re => {
      re.paymentTime = dayjs(re.paymentTime).format('YYYY-MM-DD HH:mm:ss');
      re.totalAmount = new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(re.totalAmount);
    });

    orders.value = res;
  } catch (error) {
    message.error({
      content: error.message,
      key: 'PaymentList',
      duration: 2,
    });
  }
}


// 表格列定義
const headers = ref([
  { title: '訂單編號', key: 'combinedOrderId' },
  { title: '日期', key: 'paymentTime' },
  { title: '總金額', key: 'totalAmount' },
  { title: '支付方式', key: 'paymentMethod' },
  { title: '支付狀態', key: 'paymentStatus' },
  { title: '去付款', key: 'actions', sortable: false },
]);

//設定付款狀態顏色
const getStatusColor = (status) => {
  switch (status) {
    case '付款成功': return 'green-accent-4';
    case '待付款': return 'grey-darken-1';
    case '付款失敗': return 'red';
    default: return 'grey';
  }
};

//設定付款狀態類別
const getStatusIcon = (status) => {
  switch (status) {
    case '付款成功': return 'mdi-check-circle-outline';
    case '待付款': return 'mdi-cash-multiple';
    case '付款失敗': return 'mdi-close-circle-outline';
    default: return 'mdi-cash-100';
  }
};

function IsNotPay(item) {
  return item.paymentStatus === '待付款' && item.paymentMethod === '行動支付';
}

import { useRouter } from 'vue-router';
const router = useRouter();

//取的訂單資料
import { usePaymentStore } from '@/stores/paymentStore'
const store = usePaymentStore();
function goToPay(item) {
  store.combinedOrderId = item.combinedOrderId;
  store.memberId = item.memberId;
  store.paymentTime = item.paymentTime;
  store.getOrderData();
  router.push({ name: 'pay' });
}

import { watchEffect } from 'vue';

watchEffect(() => {
  if (userInfo.value.userId) {
    getPaymentList();
  }
});


onMounted(() => {
  getPaymentList();
  if (!memberId.value) {
    router.push({ path: '/login' });
  }
})

const props = defineProps({
  tableStyle: Object,
})

</script>

<template>
  <v-container class="pa-0 container-height">
    <v-data-table :headers="headers" :items="orders" class="elevation-12 rounded-lg my-10 pa-2 mx-auto" multi-sort hover
      density="comfortable" :style="tableStyle" min-width="390">
      <template v-slot:top>
        <v-toolbar dark flat color="transparent" class="justify-center align-center">
          <v-toolbar-title class="text-center">歷史訂單</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.paymentStatus)" dark>
          {{ item.paymentStatus }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" v-if="IsNotPay(item)" @click="goToPay(item)"
          :color="getStatusColor(item.paymentStatus)" dark :icon="getStatusIcon(item.paymentStatus)">
        </v-icon>
        <v-icon class="me-2" size="small" v-else :color="getStatusColor(item.paymentStatus)" dark
          :icon="getStatusIcon(item.paymentStatus)">
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped>
.container-height {
  height: 100vh;
}
</style>
