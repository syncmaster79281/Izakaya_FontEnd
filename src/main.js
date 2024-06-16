import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import * as Icons from "@ant-design/icons-vue";
const icons = Icons;
for (const i in icons) {
  app.component(i, icons[i]);
}

import vuetify from "@/plugins/vuetify";
//pinia 存到localstorage
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount("#app");
