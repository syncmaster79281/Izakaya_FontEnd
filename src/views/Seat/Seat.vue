<template>
  <v-container fluid class="book-a-table" data-aos="fade-up">
    <v-row>
      <v-col cols="12">
        <div class="section-title">
          <h2>Reservation</h2>
          <p>Book a Table</p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field v-model="name" label="訂位人姓名" placeholder="訂位人姓名" autocomplete="off" outlined :rules="nameRules"
          required></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="email" label="訂位人Email" placeholder="訂位人Email" autocomplete="off" outlined
          :rules="emailRules" required></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="phone" label="訂位人手機號碼" placeholder="訂位人手機號碼" autocomplete="off" outlined
          :rules="phoneRules" required></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="date" label="用餐日期" placeholder="用餐日期" autocomplete="off" outlined required
          :readonly="true"></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-autocomplete v-model="adults" label="請選擇用餐人數" placeholder="請選擇用餐人數" :items="adultsOptions" item-text="title"
          item-value="value" outlined required></v-autocomplete>
      </v-col>
      <v-col cols="12" md="4">
        <v-autocomplete v-model="kids" label="請選擇小孩數" placeholder="請選擇小孩數" :items="childOptions" item-text="title"
          item-value="value" outlined required></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="messageData" label="其他備註" placeholder="其他備註" rows="5" outlined></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="submitReservation">確認預約</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
// API 資料傳遞
import axios from 'axios'; // 导入axios库

const name = ref('');
const email = ref('');
const phone = ref('');
const date = ref('');
const adults = ref(2);
const kids = ref(0);
const messageData = ref('');

const qty = computed(() => {
  return adults.value + kids.value
});


function formatDateTime(dateTime) {
  const dateObj = new Date(dateTime);
  const year = dateObj.getFullYear();
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  const day = ('0' + dateObj.getDate()).slice(-2);
  const hours = ('0' + dateObj.getHours()).slice(-2);
  const minutes = ('0' + dateObj.getMinutes()).slice(-2);

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

const childOptions = ref([]);
const adultsOptions = ref([]);

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
// 從路由提取BranchId的數值
const branchId = route.query.branchId;




import dayjs from 'dayjs';
import { message } from 'ant-design-vue';


const emailRules = [
  (v) => !!v || 'Email 是必填的',
  (v) => /.+@.+\..+/.test(v) || 'Email 格式不正确',
];
const phoneRules = [
  (v) => !!v || '手機號碼 是必填的',
  (v) => /^09\d{8}$/.test(v) || '手機號碼 格式不正确，請確認是否以09開頭並且總共為10位數',
];
const nameRules = [
  (v) => !!v || '姓名 是必填的',
];

// API 資料傳遞
// 定义发送POST请求的函数
async function sendReservationData() {
  try {
    const reservationDto = {
      // 将表单数据作为参数传递给POST请求
      'Name': name.value,
      "Email": email.value,
      'Tel': phone.value,
      'OrderTime': dayjs().format(),
      'ReservationTime': dayjs(date.value).format(),
      'Adult': adults.value,
      'Child': kids.value,
      'Message': messageData.value,
      'BranchId': branchId,
      'SeatId': 1,
      'MemberId': null,
      'Status': "預約",
      'Qty': qty.value,
      'FillUp': "0",
      'Random': ""
    }
    const response = await axios.post('https://localhost:7259/api/Reservations', reservationDto);
    message.success({
      content: response.data,
      key: '訂位資訊',
      duration: 1,
    });
    const text = response.data;
    // 处理请求成功的情况，根据需要进行相应的操作
    console.log('Reservation submitted:', response.data);
    if (text.includes("成功")) {
      setTimeout(() => {
        //3秒後跳轉回首頁
        router.push({ name: "home" });
      }, 3000);
    } else {
      message.error({
        content: response.data,
        key: '訂位資訊',
        duration: 2,
      });
    }
  } catch (error) {
    message.error({
      content: error.message,
      key: '訂位資訊',
      duration: 2,
    });
    // 处理请求失败的情况，根据需要进行相应的操作
    console.error('Error submitting reservation:', error);
  }

  // 页面重定向到首页
}

watch(adults, (newValue) => {
  updateChildOptions(newValue);
}, { immediate: true });

childOptions.value = [
  { value: 0, label: '0位小孩', title: '0位小孩' },
  { value: 1, label: '1位小孩', title: '1位小孩' },
  { value: 2, label: '2位小孩', title: '2位小孩' },
  { value: 3, label: '3位小孩', title: '3位小孩' },
];
adultsOptions.value = [
  { value: 1, label: '1位大人', title: '1位大人' },
  { value: 2, label: '2位大人', title: '2位大人' },
  { value: 3, label: '3位大人', title: '3位大人' },
  { value: 4, label: '4位大人', title: '4位大人' },
]


function updateChildOptions(adultCount) {
  const maxKids = 4 - parseInt(adultCount);

  const childOptionData = [
    { value: 0, label: '0位小孩', title: '0位小孩' },
    { value: 1, label: '1位小孩', title: '1位小孩' },
    { value: 2, label: '2位小孩', title: '2位小孩' },
    { value: 3, label: '3位小孩', title: '3位小孩' },
  ];

  const updatedChildOptions = childOptionData.filter(option => option.value <= maxKids);
  kids.value = Math.min(kids.value, maxKids);
  childOptions.value = updatedChildOptions;
}

function validateEmail() {
  return emailRules.every(rule => rule(email.value) === true);
}

function validatePhone() {
  return phoneRules.every(rule => rule(phone.value) === true);
}
function validateName() {
  return nameRules.every(rule => rule(name.value) === true);
}
function submitReservation() {
  if (validateEmail() && validatePhone() && validateName()) {
    sendReservationData();
  }
}
onMounted(() => {
  adults.value = 2;
  // console.log(adults.value)
  updateChildOptions(adults.value);
  const dateTime = formatDateTime(route.query.dateTime);
  date.value = dateTime;
});
</script>

<style scoped>
.book-a-table {
  height: 100vh;
}
</style>