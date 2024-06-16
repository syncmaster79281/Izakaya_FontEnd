//axios基礎封装
import axios from "axios";

const http = axios.create({
  baseURL: "https://localhost:7259/api/",
  timeout: 5000,
});

import { useUserStore } from "@/stores/user.js";

//錯誤訊息提示
import { message } from "ant-design-vue";
const success = (msg) => {
  message.success(`${msg}`);
};
const error = (msg) => {
  message.error(`${msg}`);
};
const warning = (msg) => {
  message.warning(`${msg}`);
};

// axios請求攔截器
http.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.userInfo.token;

    if (token) {
      config.headers.Authorization = `Izakaya ${token}`;
    }

    return config;
  },
  (e) => Promise.reject(e)
);

import { useRouter } from "vue-router";
// axios響應攔截器
http.interceptors.response.use(
  (res) => res.data,
  (e) => {
    error(e.response.data);
    //401 token過期
    if (e.response.status === 401) {
      const userStore = useUserStore();
      userStore.clearUserInfo();
      const router = useRouter();
      router.push("/login");
    }
    return Promise.reject(e);
  }
);

//全局默認值
// http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// http.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded";

export default http;
