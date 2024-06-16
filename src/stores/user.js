import { ref } from "vue";
import { defineStore } from "pinia";
import { loginApi } from "@/apis/user.js";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref({});

  const getUserInfo = async ({ email, password }) => {
    const res = await loginApi({ email, password });
    userInfo.value = res;
  };

  const clearUserInfo = () => {
    userInfo.value = {};
  };

  // 新增方法來更新從 Google 登入獲得的用戶資訊
  const updateUserInfoFromThirdParty = (user) => {
    userInfo.value.email = user.email;
    userInfo.value.displayName = user.name;
    userInfo.value.token = user.token;
  };

  return { userInfo, getUserInfo, clearUserInfo, updateUserInfoFromThirdParty };
}, {
  persist: true,
});
