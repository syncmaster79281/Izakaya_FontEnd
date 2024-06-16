<script setup>
import axios from 'axios';
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { auth, provider } from '@/firebaseConfig'; // 引入 firebaseConfig.js 中的 auth 和 provider
import { signInWithPopup } from 'firebase/auth';

const email = ref('');
const password = ref('');
const visible = ref(false);
const userStore = useUserStore();
const router = useRouter();
const token = userStore.userInfo.token; // 从Pinia存储中获取Token



onMounted(() => {
  document.body.style.backgroundColor = 'black';
});

onUnmounted(() => {
  document.body.style.backgroundColor = '#0c0b09';
});

const login = async () => {
  try {
    await userStore.getUserInfo({ email: email.value, password: password.value });
    if (userStore.userInfo && userStore.userInfo.token) {
      router.push({ name: 'home' });
    }
  } catch (error) {
    message.error('登入失敗，請檢察您的郵箱和密碼。');
  }
};
const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 获取用户的 token 和基本信息
    const userInfo = {
      name: user.displayName,
      email: user.email,
      token: user.accessToken,
    };

    // 更新 Pinia 中的用户状态
    userStore.updateUserInfoFromThirdParty(userInfo);

    // 调用后端 API，保存用户信息
    await saveUserInfoToBackend(userInfo);

    // 登录成功，跳转到首页
    router.push({ name: 'home' });
  } catch (error) {
    console.error(error);
    alert('Google 登入失敗，請稍後再試。');
  }
};


const saveUserInfoToBackend = async (userInfo) => {
  try {
    const response = await axios.post('https://localhost:7259/api/UserInfo', userInfo);
    console.log(response.data);
    // 处理成功响应
  } catch (error) {
    console.error('保存用戶信息失敗', error);
    // 处理错误
  }
};

const quickTest = () => {
  email.value = "4229259@gmail.com";
  password.value = "19980625";
}
</script>



<template>
  <div style="background-color: black; width: 100%; height: 100vh;" class="d-flex justify-center align-center">
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg" width="600">

      <v-img class="mx-auto my-6" max-width="228" src="/assets/img/logo/logo-izakaya.jpg"
        @click="router.push({ name: 'home' })"></v-img>
        
      <div class="text-subtitle-1 text-medium-emphasis">信箱</div>
      <v-text-field v-model="email" density="compact" placeholder="信箱地址" prepend-inner-icon="mdi-email-outline"
        variant="outlined"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        密碼

        <RouterLink :to="{ name: 'ForgotPassword' }" class="text-caption text-decoration-none text-blue">忘記密碼?
        </RouterLink>

      </div>

      <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'" density="compact" placeholder="密碼" prepend-inner-icon="mdi-lock-outline"
        variant="outlined" @click:append-inner="visible = !visible"></v-text-field>

      <v-btn @click="login" class="mb-8" size="large" block>登入</v-btn>

      <v-card class="google-card d-flex justify-center align-center" @click="loginWithGoogle" color="transparent"
        height="64" tile>
        <v-img src="/assets/img/logo/google.png" alt="Google 登入" width="64" height="64"></v-img>
      </v-card>

      <v-card-text class="text-center">
        <RouterLink :to="{ name: 'Register' }" class="text-blue text-decoration-none">
          註冊會員<v-icon icon="mdi-chevron-right"></v-icon>
        </RouterLink>
        <v-btn @click="quickTest">快速測試</v-btn>
      </v-card-text>

    </v-card>
  </div>
</template>

<style scoped>
.google-card {
  position: relative;
  transition: transform 0.3s ease;
}

.google-card:hover {
  transform: scale(1.05);
}
</style>