<template>
  <v-container fluid class="pa-0 custom-container d-flex justify-center align-center about">
    <v-row class="ma-4  d-flex justify-center align-center">
      <!-- 第一间店 -->
      <v-col cols="12" md="12">
        <v-card class="mx-auto ma-4 rounded-xl" elevation="12" max-height="300" width="100%" max-width="900">
          <v-row no-gutters>
            <v-col cols="5">
              <v-img src="https://i.pinimg.com/originals/08/82/7a/08827a3087ed4d03ba1bbf0ff9d7b378.jpg"
                alt="Booking Image" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="100%" cover @click="branchSelection(1)">
              </v-img>
            </v-col>
            <v-col cols="7">
              <v-card-title class="text-h5"
                style="display: flex; justify-content: space-between; align-items: center;">IZAKAYA - 台北店
                <v-btn color="primary" @click="changeToBranch1Map">查看地圖</v-btn>
              </v-card-title>

              <v-card-text>
                <div class="text-subtitle-1">餐廳地址 : {{ branch1 }}</div>
                <div class="text-subtitle-1 mb-2">剩餘可預定日期：</div>
                <template v-for="(item, index) in availableDatesBranch1.slice(0, 5)" :key="index">
                  <template v-if="item.orders <= maxAllowedQty">
                    <v-chip class="ma-1 date-chip" color="deep-purple-accent-4" dark size="large"
                      @click="handleDateSelection(1, item.dateTime)">
                      {{ formatDateString(item.dateTime) }}
                    </v-chip>
                  </template>
                </template>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- 第二间店 -->
      <v-col cols="12" md="12">
        <v-card class="mx-auto ma-4 rounded-xl" elevation="12" max-height="300" width="100%" max-width="900">
          <v-row no-gutters>
            <v-col cols="5">
              <v-img
                src="https://th.bing.com/th/id/R.5ba53bfbe4041accc81b69ac7492f24b?rik=DwBNB3Z%2fRNkXZg&riu=http%3a%2f%2fjintangjiang.oss-cn-beijing.aliyuncs.com%2fimages%2f74df368b785f33241a0123850e39fae0dd272b97.JPG&ehk=805ClwdZIBHrhvC1yoH5rHFuAnyozKDkoY9rT7IhImc%3d&risl=&pid=ImgRaw&r=0"
                alt="Booking Image" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="100%" cover @click="branchSelection(2)"></v-img>
            </v-col>
            <v-col cols="7">
              <v-card-title class="text-h5"
                style="display: flex; justify-content: space-between; align-items: center;">IZAKAYA - 台中店
                <v-btn color="primary" @click="changeToBranch2Map">查看地圖</v-btn>
              </v-card-title>
              <v-card-text>
                <div class="text-subtitle-1">餐廳地址 : {{ branch2 }}</div>
                <div class="text-subtitle-1 mb-2">剩餘可預定日期：</div>
                <template v-for="(item, index) in availableDatesBranch2.slice(0, 5)" :key="index">
                  <template v-if="item.orders <= maxAllowedQty">
                    <v-chip class="ma-1 date-chip" color="deep-purple-accent-4" dark size="large"
                      @click="handleDateSelection(2, item.dateTime)">
                      {{ formatDateString(item.dateTime) }}
                    </v-chip>
                  </template>
                </template>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
const branch1 = "台北市復興南路一段390號2樓";
const branch2 = "台中市南屯區公益路二段51號18樓";
const branch1Map = "https://www.google.com.tw/maps/dir//106%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%AE%89%E5%8D%80%E5%BE%A9%E8%88%88%E5%8D%97%E8%B7%AF%E4%B8%80%E6%AE%B5390%E8%99%9F%E8%B3%87%E5%B1%95%E5%9C%8B%E9%9A%9B%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B82%E6%A8%93/@25.033913,121.5427692,19z/data=!3m1!5s0x3442abd3799b10c5:0xd096eb3dd7a37f22!4m9!4m8!1m0!1m5!1m1!1s0x3442abd379a5ec97:0xedc006d25a9e35df!2m2!1d121.5434129!2d25.033913!3e0?entry=ttu";
const branch2Map = "https://www.google.com.tw/maps/dir//408%E5%8F%B0%E4%B8%AD%E5%B8%82%E5%8D%97%E5%B1%AF%E5%8D%80%E5%85%AC%E7%9B%8A%E8%B7%AF%E4%BA%8C%E6%AE%B551%E8%99%9F%E8%B3%87%E5%B1%95%E5%9C%8B%E9%9A%9B-%E5%8E%9F+%E8%B3%87%E7%AD%96%E6%9C%83-%E6%95%B8%E4%BD%8D%E6%95%99%E8%82%B2%E7%A0%94%E7%A9%B6%E6%89%80-%E4%B8%AD%E5%8D%8018%E6%A8%93/@24.1505405,120.64845,17z/data=!3m1!5s0x34693d9650e02d45:0x448356d4b176da02!4m9!4m8!1m0!1m5!1m1!1s0x34693d9650422ae1:0x334dfd5796c49ff6!2m2!1d120.6510249!2d24.1505405!3e0?entry=ttu";

const changeToBranch1Map = () => {
  window.location.href = branch1Map;
};
const changeToBranch2Map = () => {
  window.location.href = branch2Map;
};

const router = useRouter();

const handleDateSelection = (branchId, dateTime) => {
  // 導航到 /seat 頁面並傳遞日期時間數據作為 query 參數
  router.push({ path: '/seat', query: { branchId, dateTime } });
};

const branchSelection = (branchId) => {
  // 導航到 /seat 頁面並傳遞日期時間數據作為 query 參數
  router.push({ path: '/calendarbooking', query: { branchId } });
};

// 最大預訂訂位數
const maxAllowedQty = ref(0);
// orders 訂單數量
const availableDatesBranch1 = ref([{ dateTime: '', orders: 0 }]);
const availableDatesBranch2 = ref([{ dateTime: '', orders: 0 }]);

const init = async () => {
  availableDatesBranch1.value = [];
  availableDatesBranch2.value = [];
  // 循环生成未来30天的日期
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + i);

    // 跳過星期一
    if (currentDate.getDay() === 1) {
      continue;
    }

    const times = ["17:00", "18:00", "19:00"];

    // 迴圈分店1,2
    for (let branchId = 1; branchId <= 2; branchId++) {
      // 獲取不同分店和時間段的預約數據
      for (let time of times) {
        let date = `${formatDate(currentDate)} ${time}`;
        const res = await axios.get(`https://localhost:7259/api/Reservations/GetSeatIsused?ReservationTime=${date}&BranchId=${branchId}`);

        if (res.data <= maxAllowedQty.value) {
          if (branchId === 1) {
            availableDatesBranch1.value.push({ dateTime: `${formatDate(currentDate)} ${time}`, orders: res.data });
          } else if (branchId === 2) {
            availableDatesBranch2.value.push({ dateTime: `${formatDate(currentDate)} ${time}`, orders: res.data });
          }
        }
      }
    }
  }
};

onMounted(() => {
  init();
});

// 格式化日期函数
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

const formatDateString = (dateTime) => {
  const date = new Date(dateTime);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${month} ${day}日 ${hour}:${minute}`;
};
</script>

<style scoped>
.custom-container {
  height: 100vh;
}

.about {
  background: url("/assets/img/about/about-bg.jpg") center center;
  background-size: cover;
  position: relative;
  padding: 80px 0;
}

.about:before {
  content: "";
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}
</style>
