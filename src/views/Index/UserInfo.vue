<script setup>
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user.js"
import { computed } from "vue"
const store = useUserStore();

const lastTwoCharsOfName = computed(() => {
  // 确保 store.userInfo.name 已定义且不为空
  if (store.userInfo.name) {
    return store.userInfo.name.slice(-2);
  }
  // 如果 store.userInfo.name 未定义或为空，可以返回一个默认值或空字符串
  return '';
});
const image = "/assets/img/logo/avator.jpg";
const router = useRouter();

const LogoutHandler = () => {
  store.clearUserInfo();
  router.push('/login');
};

const shouldShowMenu = computed(() => {
  return store.userInfo.token ? true : false;
});

</script>

<template>
  <div class="d-none d-sm-flex">
    <template v-if="shouldShowMenu">
      <v-menu min-width="58px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="large">
              <v-img :alt="store.userInfo.name" :src="image"></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="brown">
                <span class="text-subtitle-1">{{ lastTwoCharsOfName }}</span>
              </v-avatar>
              <h3>{{ store.userInfo.name }}</h3>
              <p class="text-caption mt-1">
                {{ store.userInfo.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-icon color="gray" icon="mdi-account" left></v-icon>
              <v-btn variant="plain" rounded :to="{ name: 'member' }">
                會員中心
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-icon color="gray" icon="mdi-credit-card-scan-outline" left></v-icon>
              <v-btn variant="plain" rounded :to="{ name: 'payment' }">
                線上結帳
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-icon color="gray" icon="mdi-logout" left></v-icon>
              <v-btn variant="plain" rounded @click="LogoutHandler">
                登出
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>

    <template v-else>
      <v-btn dark icon color="white" :to="{ name: 'login' }">
        <v-icon>mdi-login</v-icon>
        <span>登入</span>
      </v-btn>
    </template>
  </div>
</template>