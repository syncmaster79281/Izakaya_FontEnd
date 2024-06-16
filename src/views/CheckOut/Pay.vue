<script setup>

import { computed, onMounted, ref } from 'vue';


import { usePaymentStore } from '@/stores/paymentStore'
const store = usePaymentStore();


import { storeToRefs } from 'pinia';
const { combinedOrderId, memberId, paymentTime, orderDetail, paymentConfirmDto, bestDiscount } = storeToRefs(store);


// 格式化金額
const formattedAmount = computed(() => {
  return orderDetail.value.amount ? `NT$${orderDetail.value.amount.toFixed(0)}` : 'NT$0';
});

// 計算總品項
const totalItems = computed(() => {
  return orderDetail.value.packages ? orderDetail.value.packages.reduce((acc, order) => acc + order.products.length, 0) : 0;
});

// 優惠卷
const originalAmount = computed(() => orderDetail.value.amount || 0); // 原始金額


import { getRewardsApi } from '@/apis/pay';

const coupons = ref([]);

// 獲取優惠卷
const getRewardsList = async () => {
  try {
    const res = await getRewardsApi(memberId.value);
    coupons.value = transformDataToCoupons(res);
  } catch (error) {
    message.error({
      content: error.message,
      key: 'RequestApi',
      duration: 2,
    });
  }
};


//轉換優惠卷資料格式
function transformDataToCoupons(data) {
  return data.map(coupon => ({
    id: coupon.id,
    title: coupon.name,
    value: `discount${parseInt(coupon.discountMethod * 100)}`,
    discount: (amount) => amount * coupon.discountMethod
  }));
}

// 優惠卷類型
// const coupons = [
//   { title: '9折', value: 'discount90', discount: (amount) => amount * 0.9 },
//   { title: '8折', value: 'discount80', discount: (amount) => amount * 0.8 },
//   { title: '7折', value: 'discount70', discount: (amount) => amount * 0.7 },
//   { title: '6折', value: 'discount60', discount: (amount) => amount * 0.6 },
//   { title: '5折', value: 'discount50', discount: (amount) => amount * 0.5 },
// ];

// 選中的優惠卷
const selectedCoupons = ref([]);

//最大折扣
const bestDiscountInfo = computed(() => {
  let maxDiscount = { amount: originalAmount.value, title: '', value: '', id: 0 };
  selectedCoupons.value.forEach(couponValue => {
    const coupon = coupons.value.find(c => c.value === couponValue);
    if (coupon) {
      const discountedAmount = coupon.discount(originalAmount.value);
      if (discountedAmount < maxDiscount.amount) {
        maxDiscount = { amount: discountedAmount, title: coupon.title, value: coupon.value, id: coupon.id };
      }
    }
  });
  return {
    label: maxDiscount.title,
    value: maxDiscount.value,
    id: maxDiscount.id,
    finalAmount: maxDiscount.amount.toFixed(0)
  };
});

// 更新優惠卷選项
const couponItems = computed(() => coupons.value.map(c => ({ title: c.title, value: c.value, id: c.id })));



const selectedPaymentMethod = ref('');

const paymentMethods = ref([
  // { label: 'Google Pay', value: 'googlePay', imgSrc: '/assets/img/linePay/googlePay.png' },
  // { label: 'Apple Pay', value: 'applePay', imgSrc: '/assets/img/linePay/applePay.png' },
  { label: 'Line Pay', value: 'linePay', imgSrc: '/assets/img/linePay/LinePay.png' }
]);

const selectPaymentMethod = (value) => {
  selectedPaymentMethod.value = value;
};


function applyDiscount(originalOrderDetail, discountType) {
  let discountRate = 1;


  if (typeof discountType === 'string' && discountType.startsWith('discount')) {
    discountRate = parseFloat(discountType.replace('discount', '')) / 100;          // 例如 discount90 代表打9折
  }

  const updatedPackages = originalOrderDetail.packages.map(pkg => {
    // 更新每個產品的價格
    const updatedProducts = pkg.products.map(product => ({
      ...product,
      price: Math.round(product.price * discountRate)
    }));

    // 重新计算金额
    const updatedPackageAmount = updatedProducts.reduce((acc, product) => acc + (product.quantity * product.price), 0);

    return {
      ...pkg,
      amount: updatedPackageAmount,
      products: updatedProducts
    };
  });

  // 重新计算訂單的金额
  const updatedOrderAmount = updatedPackages.reduce((total, pkg) => total + pkg.amount, 0);

  return {
    ...originalOrderDetail,
    amount: updatedOrderAmount,
    packages: updatedPackages
  };
}


import { LinePayRequestApi } from '@/apis/pay';

import { message } from 'ant-design-vue';

// 結帳邏輯
const checkout = async () => {
  // 更新訂單
  const updatedOrderDetail = applyDiscount(orderDetail.value, bestDiscountInfo.value.value);

  //紀錄折扣後的訂單金額
  paymentConfirmDto.value = {
    amount: updatedOrderDetail.amount,
    currency: updatedOrderDetail.currency
  };

  //紀錄最佳折扣
  bestDiscount.value = bestDiscountInfo.value;

  const requestData = {
    ...updatedOrderDetail,
    redirectUrls: {
      confirmUrl: 'https://localhost:8080/checkout/confirm',
      cancelUrl: 'https://localhost:8080/checkout/cancel'
    }
  }

  try {
    const res = await LinePayRequestApi(requestData);
    if (res.returnCode !== '0000') {
      throw new Error(res.returnMessage);
    }
    window.location = res.info.paymentUrl.web;
  } catch (error) {
    message.error({
      content: error.message,
      key: 'RequestApi',
      duration: 2,
    });
  }

};
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(() => {
  getRewardsList();
});

</script>

<template>
  <v-container fluid class="pa-0 container-height">
    <v-row class="ma-4">
      <!-- 餐點明細 -->
      <v-col cols="12" md="6">
        <v-card class="mb-4  rounded-lg" elevation="12">
          <v-card-title>餐點明細</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="order in orderDetail?.packages" :key="order.id" class="mb-2">
                <v-list-item-title>座位: {{ order.name }} - 小計: {{ order.amount }}</v-list-item-title>
                <v-list-item-subtitle>
                  <div v-for="product in order.products" :key="product.id" class="d-flex align-center">
                    <v-avatar size="36px" class="me-2">
                      <v-img :src="product.imageUrl"></v-img>
                    </v-avatar>
                    {{ product.name }} - {{ product.quantity }} x NT${{ product.price }}
                  </div>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="d-flex flex-column">
        <!-- 訂單明細 -->
        <v-card class="mb-4 rounded-lg flex-grow-1" elevation="12">
          <v-card-title class="text-h5 font-weight-bold">確認訂單</v-card-title>
          <v-card-text>
            <div class="text-subtitle-1">訂單編號: {{ combinedOrderId }}</div>
            <div class="text-subtitle-1">會員ID: {{ memberId }}</div>
            <div class="text-subtitle-1">訂單時間: {{ paymentTime }}</div>
            <div class="text-subtitle-1">總金額: {{ formattedAmount }}</div>
            <div class="text-subtitle-1">總品項: {{ totalItems }}</div>
          </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
        <!-- 優惠卷 -->
        <v-card class="mb-4  rounded-lg flex-grow-1" elevation="12">
          <v-card-title>優惠卷</v-card-title>
          <v-card-text>
            <v-autocomplete v-model="selectedCoupons" :items="couponItems" item-title="title" item-value="value"
              label="選擇優惠卷" variant="outlined" dense clearable multiple chips closable-chips>
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" :text="item.raw.title" color="deep-purple-accent-4" dark></v-chip>
              </template>
            </v-autocomplete>
            <div>
              最大折扣: <strong class="highlight">{{ bestDiscountInfo.label }}</strong>
            </div>
            <div>
              實付金額: <strong class="highlight">NT$ {{ bestDiscountInfo.finalAmount }}</strong>
            </div>
          </v-card-text>
        </v-card>
        <!-- 付款方式 -->
        <v-card class="mb-4 rounded-lg" elevation="12">
          <v-card-title>選擇付款方式</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4" v-for="method in paymentMethods" :key="method.value"
                @click="selectPaymentMethod(method.value)">
                <v-card :class="['payment-method', { 'selected': selectedPaymentMethod === method.value }]"
                  elevation="2">
                  <v-card-title class="justify-center">
                    <v-img :src="method.imgSrc" class="payment-img"></v-img>
                  </v-card-title>
                  <v-card-text class="text-center">
                    {{ method.label }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <!--按钮 -->
          <v-card-actions class="justify-end align-center">
            <v-btn @click="checkout" color="primary" variant="outlined" flat>結帳</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>
.container-height {
  max-height: 840px;
  height: 840px;
  overflow-y: auto;
}

.payment-method {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.payment-method:hover {
  transform: translateY(-5px);
}

.payment-method.selected {
  border: 2px solid rgb(226, 151, 52);
}

.payment-img {
  max-height: 50px;
}

.highlight {
  color: red;
  font-weight: bold;
}
</style>
