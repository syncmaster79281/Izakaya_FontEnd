<script setup>
import { onMounted, ref, watch, watchEffect, computed } from 'vue';
//透過路由傳遞seatId
const props = defineProps({
  seatId: {
    type: String,
    required: true,
  },
  branchId: {
    type: String,
    required: true,
  }
})

//搜尋框搜尋
const searchText = ref('');

import { GetProductCategoryApi, GetProductApi } from '@/apis/seatCart'
//取得產品類別
const categoryList = ref([]);
const getCategoryList = async () => {
  const res = await GetProductCategoryApi();
  categoryList.value = res;
}
//取得產品列表
const productList = ref([]);
const getProductList = async () => {
  const res = await GetProductApi(props.branchId);
  productList.value = res;
}
onMounted(() => {
  getCategoryList();
  getProductList();
})

//tab 切換產品類別
const tab = ref(0);


//定義多重篩選物件
const filteredProducts = ref([]);
const applyFilters = () => {
  filteredProducts.value = productList.value.filter(product => {
    const matchesSearchText = !!searchText.value ? product.name.toLowerCase().includes(searchText.value.toLowerCase()) : true;
    if (tab.value == 0) {
      return matchesSearchText;
    } else {
      const matchesCategory = product.categoryId === tab.value;
      return matchesSearchText && matchesCategory;
    }
  });
};

watchEffect(() => {
  applyFilters();
});


//添加購物車
import { useCartStore } from '@/stores/cartStore';
import { storeToRefs } from 'pinia';
const cartStore = useCartStore();
const { carts } = storeToRefs(cartStore);
const { addCart, removeCart, clearCart } = cartStore;


//取的點餐清單
const orderList = computed(() => {
  return carts.value[props.seatId] || [];
});

//判斷是否有點餐
const haveCart = computed(() => {
  return (carts.value[props.seatId] || []).length > 0;
})

// 移除商品
const removeItem = (itemId) => {
  removeCart(props.seatId, itemId);
};

//引入時間插件
import dayjs from 'dayjs';

//資料轉型
const prepareOrderData = (cartList, seatId) => {
  return cartList.map(({ id, unitPrice, qty }) => ({
    SeatId: seatId,
    ProductId: id,
    CartStatusId: 2,
    UnitPrice: unitPrice,
    Qty: qty,
    Notes: '',
    OrderTime: dayjs().format(),
  }));
};

import { PlaceOrderApi } from '@/apis/seatCart'


// 提交點餐
const submitOrder = () => {
  // 判断是否有點餐
  if (haveCart.value) {
    const currentCartList = carts.value[props.seatId] || [];
    const orderDataList = prepareOrderData(currentCartList, props.seatId);
    SentOrder(orderDataList);
    clearCart(props.seatId);
  }
};



//全局提示
import { message } from 'ant-design-vue';
const SentOrder = async (orderDataList) => {
  try {
    const res = await PlaceOrderApi(orderDataList);
    message.success({
      content: res,
      key: '送出訂單',
      duration: 2,
    });
  }
  catch (error) {
    message.error({
      content: error.message,
      key: '送出訂單',
      duration: 2,
    });
  }
}

//開啟購物車dialog
const cartDialog = ref(false);
const openCartDialog = () => {
  cartDialog.value = true;
}


// 獲取當前座位商品数量
const totalQty = cartStore.totalQty(props.seatId);

//獲取當前座位商品總價
const totalPrice = cartStore.totalPrice(props.seatId);


// 監聽視窗尺寸變化
import { useWindowSize } from '@vueuse/core';
const { width } = useWindowSize();
const isHide = computed(() => {
  return width.value >= 600
})
watch(width, (currentWidth) => {
  if (currentWidth >= 600) {
    cartDialog.value = false
  }
})

import { GetHistoryApi } from '@/apis/seatCart'
//歷史訂單
const historyList = ref([]);
const getHistoryList = async () => {
  const orderTime = dayjs().format("YYYY-MM-DD HH:mm:ss");  //當下時間
  const res = await GetHistoryApi(props.seatId, orderTime);
  historyList.value = res;
}
const historyDialog = ref(false);
const openHistoryDialog = () => {
  getHistoryList();
  historyDialog.value = true
}

// 計算歷史訂單總數量
const historyListQty = computed(() => {
  return historyList.value.reduce((total, item) => total + item.qty, 0);
});

//計算歷史訂單總價錢
const historyListTotalPrice = computed(() => {
  return historyList.value.reduce(
    (total, item) => total + item.unitPrice * item.qty,
    0
  );
});

</script>

<template>
  <v-row class="mt-5">
    <v-col cols="12" md="4" class="d-flex align-center">
      <v-responsive class="mx-auto">
        <v-text-field hide-details="auto" label="店內搜尋" placeholder="餐點名稱" clearable variant="outlined"
          class="mt-2 rounded-xl" v-model="searchText">
          <template v-slot:append-inner>
            <v-icon>mdi-magnify</v-icon>
          </template>
        </v-text-field>
      </v-responsive>
    </v-col>
    <v-col cols="12" md="6" class="d-flex align-center">
      <v-tabs bg-color="transparent" center-active dark color="deep-purple-accent-4" show-arrows v-model="tab">
        <v-tab class="font-weight-bold rounded-pill font-weight-medium" value=0>全部</v-tab>
        <v-tab class="font-weight-bold rounded-pill font-weight-medium" v-for="category of categoryList"
          :key="category.id" :value="category.id">{{
            category.name }}</v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12" md="2" class="d-flex align-center">
      <v-toolbar color="transparent" dark flat>
        <v-toolbar-title class="d-flex justify-center font-weight-bold" :text="`桌號: ${props.seatId}`"></v-toolbar-title>
        <v-btn icon color="deep-orange-darken-1" dark @click="openHistoryDialog" class="d-flex">
          <v-badge color="error" size="small" :content="historyListQty !== 0 ? historyListQty : ''">
            <v-icon size="large">mdi-clipboard-clock-outline</v-icon>
          </v-badge>
        </v-btn>
        <v-dialog v-model="historyDialog" max-width="600">
          <v-card class="rounded-lg">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>歷史訂單</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="historyDialog = !historyDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pa-0 d-flex align-center justify-content-around">
              <v-list dense class="pa-0 " width="100%">
                <v-list-item v-for="item in historyList" :key="item.id">
                  <v-row align="center">
                    <v-col cols="4" class="d-flex justify-center">
                      <v-list-item-title class="font-weight-bold">{{ item.productName }}</v-list-item-title>
                    </v-col>
                    <v-col cols="4" class="d-flex justify-center">
                      <v-list-item-subtitle class="font-weight-bold">{{ item.unitPrice }} 元 x {{ item.qty
                        }}</v-list-item-subtitle>
                    </v-col>
                    <v-col cols="4" class="d-flex justify-center">
                      <v-chip variant="elevated" size="large"
                        :color="item.cartStatus === '已完成' ? 'light-blue-accent-3' : 'green-accent-3'">
                        {{ item.cartStatus }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider></v-divider>
                <v-container fluid class="pa-4">
                  <v-row>
                    <v-col cols="5" class="d-flex justify-center">
                      <span class="font-weight-bold">總筆數：{{ historyListQty }}筆</span>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-center">
                      <span class="font-weight-bold"></span>
                    </v-col>
                    <v-col cols="5" class="d-flex justify-center">
                      <span class="font-weight-bold">小計：{{ historyListTotalPrice?.toFixed(0) }}元</span>
                    </v-col>
                  </v-row>
                </v-container>
                <v-divider></v-divider>
              </v-list>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-btn icon color="deep-purple-darken-1" dark @click="openCartDialog" class="d-flex d-sm-none d-md-none">
          <v-badge color="error" size="small" :content="totalQty !== 0 ? totalQty : ''">
            <v-icon size="large">mdi-shopping-outline</v-icon>
          </v-badge>
        </v-btn>
        <v-dialog v-model="cartDialog" max-width="600">
          <v-card class="rounded-lg">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>購物車清單</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="cartDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pa-0 d-flex align-center justify-content-around">
              <v-list dense class="pa-0 " width="100%">
                <v-list-item v-for="item in orderList" :key="item.id">
                  <v-row align="center">
                    <v-col cols="4" class="d-flex justify-center">
                      <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
                    </v-col>
                    <v-col cols="4" class="d-flex justify-center">
                      <v-list-item-subtitle class="font-weight-bold">{{ item.unitPrice }} 元 x {{ item.qty
                        }}</v-list-item-subtitle>
                    </v-col>
                    <v-col cols="4" class="d-flex justify-center">
                      <v-list-item-action>
                        <v-icon icon color="red" @click="removeItem(item.id)">mdi-trash-can-outline</v-icon>
                      </v-list-item-action>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider></v-divider>
                <v-container fluid class="pa-4">
                  <v-row>
                    <v-col cols="5" class="d-flex justify-center">
                      <span class="font-weight-bold">總筆數：{{ totalQty }}筆</span>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-center">
                      <span class="font-weight-bold"></span>
                    </v-col>
                    <v-col cols="5" class="d-flex justify-center">
                      <span class="font-weight-bold">小計：{{ totalPrice?.toFixed(0) }}元</span>
                    </v-col>
                  </v-row>
                </v-container>
                <v-divider></v-divider>
                <v-btn append-icon="mdi-cart-outline" color="primary" dark class="mt-auto rounded-lg" width="100%"
                  @click="submitOrder">點餐</v-btn>
              </v-list>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </v-col>
  </v-row>
  <v-row dense>
    <v-col cols="12" sm="6" md="8">
      <v-toolbar color="transparent" dark flat>
        <v-toolbar-title class="d-flex justify-center font-weight-bold">餐點清單</v-toolbar-title>
      </v-toolbar>
      <v-list class="pa-0 overflow-y-auto overflow-x-hidden border-2 rounded-lg" height="700" max-height="700">
        <v-item-group multiple>
          <v-row dense>
            <v-col v-for="product of  filteredProducts " :key="product.id" cols="12" sm="12" md="4">
              <v-item v-slot="{ isSelected, toggle }">
                <v-card :color="isSelected ? 'deep-purple-accent-4' : ''" class="rounded-lg" height="150" dark
                  variant="outlined" @click="toggle" dense>
                  <v-row class="d-flex flex-no-wrap justify-space-between pa-0" dense no-gutters>
                    <v-col cols="6">
                      <v-card-title>{{ product.name }}</v-card-title>
                      <v-card-subtitle>NT$:{{ product.unitPrice }}</v-card-subtitle>
                      <v-card-text class="hidden-sm-and-up">{{ product.present }}</v-card-text>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col cols="6">
                      <v-img :src="product.imageUrl" class="align-end  rounded-lg" width="100%" height="150" cover>
                        <div class="d-flex justify-end align-end">
                          <v-btn color="grey-lighten-5" dark size="large" icon="mdi-plus" variant="text"
                            @click="addCart(props.seatId, product)"></v-btn>
                        </div>
                      </v-img>
                    </v-col>
                  </v-row>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-list>
    </v-col>
    <v-col cols="12" sm="6" md="4" v-show="isHide">
      <v-toolbar color="transparent" dark flat>
        <v-toolbar-title class="d-flex justify-center font-weight-bold">點餐清单</v-toolbar-title>
      </v-toolbar>
      <v-list class="d-flex flex-column fixed-card rounded-lg border-2" dark height="700" max-height="700">
        <v-list-item v-for="item of orderList" :key="item.id" color="primary" rounded="lg">
          <v-container fluid class="pa-0">
            <v-row align="center">
              <v-col cols="4">
                <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
              </v-col>
              <v-col cols="4">
                <v-list-item-subtitle class="font-weight-bold">{{ item.unitPrice }} 元 x {{ item.qty
                  }}</v-list-item-subtitle>
              </v-col>
              <v-col cols="4">
                <v-list-item-action>
                  <v-icon icon color="red" @click="removeItem(item.id)">mdi-trash-can-outline</v-icon>
                </v-list-item-action>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
        </v-list-item>
        <v-container fluid class="pa-4">
          <v-row>
            <v-col cols="8">
              <span class="font-weight-bold">總筆數：</span>
            </v-col>
            <v-col cols="4" class="text-right">
              <span class="font-weight-bold">{{ totalQty }} 筆</span>
            </v-col>
            <v-col cols="8">
              <span class="font-weight-bold">小計：</span>
            </v-col>
            <v-col cols="4" class="text-right">
              <span class="font-weight-bold">{{ totalPrice?.toFixed(0) }} 元</span>
            </v-col>
          </v-row>
        </v-container>
        <v-btn append-icon="mdi-cart-outline" color="primary" dark class="mt-auto" @click="submitOrder">點餐</v-btn>
      </v-list>
    </v-col>
  </v-row>
</template>
