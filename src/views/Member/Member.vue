<template>
  <v-card class="rounded-0">
    <v-main id="memberCenter">
      <v-app-bar color="black" dark class="text-white" prominent density="compact">
        <v-icon @click.stop="drawer = !drawer" class="ms-5">mdi-home-circle-outline</v-icon>
        <v-app-bar-title>
          <div class="d-flex justify-space-between app-bar-title-content">
            <span>會員中心 </span><span>您好, {{ user.name }}</span><span>目前登入帳號為: {{ user.email }} </span>
          </div>
        </v-app-bar-title>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" location="left" temporary>
        <div class="d-flex flex-row">
          <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab value="option-1">
              <v-icon start>
                mdi-card-account-details-outline
              </v-icon>
              會員資料
            </v-tab>
            <v-tab value="option-2">
              <v-icon start>
                mdi-account-edit
              </v-icon>
              修改會員資料
            </v-tab>
            <v-tab value="option-3">
              <v-icon start>
                mdi-shield-key-outline
              </v-icon>
              修改會員密碼
            </v-tab>
            <v-tab value="option-4">
              <v-icon start>
                mdi-ticket
              </v-icon>
              優惠卷匣
            </v-tab>
            <v-tab value="option-5">
              <v-icon start>
                mdi-clipboard-clock-outline
              </v-icon>
              訂單資訊
            </v-tab>
          </v-tabs>
        </div>
      </v-navigation-drawer>
      <div style="width: 100%;">
        <!-- <div style="height:100px;"></div> -->
        <v-window v-model="tab">
          <v-window-item value="option-1">
            <MemberEdit></MemberEdit>
          </v-window-item>
          <v-window-item value="option-2">
            <MemberEdit></MemberEdit>
          </v-window-item>
          <v-window-item value="option-3">
            <v-layout class="d-flex justify-center align-start" style="height: 100vh;">
              <v-row justify="center" align="center">
                <v-col cols="12" sm="8" md="6" lg="4">
                  <v-card class="elevation-12" outlined>
                    <v-toolbar color="black" dark flat>
                      <v-toolbar-title>忘記密碼</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      <v-form>
                        <v-text-field v-model="email" label="請輸入您的電子郵件地址" prepend-icon="mdi-email" type="email"
                          :rules="emailRules" required solo></v-text-field>
                        <v-btn :disabled="!isValidEmail" color="success" class="mr-4" @click="sendResetEmail" block>
                          發送驗證信
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-layout>
          </v-window-item>
          <v-window-item value="option-4" style="height: 100vh;">
            <v-row class="align-center">
              <v-col cols="12" sm="6" md="4" lg="2" v-for="item in rewards" :key="item.id">
                <v-card class="reward-card ma-5" flat height="250" @click="showDetails(item)">
                  <v-img :src="`/assets/img/reward/${item.couponName}.jpg`" :alt="item.couponName" class="reward-image"
                    cover>
                  </v-img>
                  <v-card-title class="reward-couponname">
                    {{ item.couponName }}
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
            <v-dialog v-model="dialog" max-width="400px">
              <v-card class="rounded-lg">
                <v-card-text>
                  <p>{{ selectedCoupon.condition }}</p>
                  <p>開始時間: {{ selectedCoupon.startTime }}</p>
                  <p>結束時間: {{ selectedCoupon.endTime }}</p>
                  <p>注意事項: {{ selectedCoupon.description }}</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" text @click="dialog = false">關閉</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-window-item>
          <v-window-item value="option-5">
            <Payment></Payment>
          </v-window-item>
        </v-window>

      </div>
    </v-main>
  </v-card>
</template>



<script setup>
import { getRewardsApi } from "@/apis/reward.js";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/user";
import Payment from "../CheckOut/Payment.vue";
import MemberEdit from "@/views/Member/profile.vue";

const drawer = ref(false);
const userStore = useUserStore();
const tab = ref("option-1")
const user = ref(userStore.userInfo)
// console.log(userStore.userInfo.userId);
const rewards = ref([]);
const dialog = ref(false);
const selectedCoupon = ref(null);
const getRewards = async () => {
  const response = await getRewardsApi(userStore.userInfo.userId);
  response.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  rewards.value = response;
};
const showDetails = (coupon) => {
  selectedCoupon.value = coupon;
  dialog.value = true;
};

onMounted(() => {
  getRewards();
});

//忘記密碼
import axios from 'axios';
const email = ref('');
const emailRules = [
  v => !!v || 'E-mail 是必填的',
  v => /.+@.+/.test(v) || 'E-mail 必需是有效的',
];

const isValidEmail = computed(() => {
  return emailRules.every(rule => rule(email.value) === true);
});

const sendResetEmail = async () => {
  if (!isValidEmail.value) {
    return;
  }
  try {
    await axios.post('https://localhost:7259/api/ForgotPassword', {
      email: email.value,
    });
    alert(`重置密碼的信件已發送到: ${email.value}`);
  } catch (error) {
    console.error('發送重置密碼信件失敗:', error);
    alert('發送重置密碼信件失敗，請稍後重試。');
  }
};

</script>



<style scoped>
.rewards-list {
  padding: 20px;
}

.reward-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.reward-couponname {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.reward-card:hover {
  transform: translateY(-5px);
}

.reward-image {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  height: 200px;
  object-fit: cover;
}

#memberCenter {
  background-image: url("https://pic.616pic.com/bg_w1180/00/15/11/5pftdlZnlQ.jpg!/fw/880");
  background-repeat: repeat-y;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-bar-title-content span {
  font-size: 16px;
}

@media (max-width: 600px) {
  .app-bar-title-content span {
    font-size: 12px;
  }
}
</style>
