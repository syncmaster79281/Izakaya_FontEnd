import { ref } from "vue";
import { defineStore } from "pinia";

export const useNavLinkStore = defineStore("navLink", () => {
  const links = ref([
    {
      id: 1,
      title: "首頁",
      name: "home",
      path: "/",
    },
    {
      id: 2,
      title: "最新消息",
      name: "about",
      path: "/about",
    },
    {
      id: 3,
      title: "活動專區",
      name: "activity",
      path: "/activity",
    },
    {
      id: 4,
      title: "菜單",
      name: "menu",
      path: "/menu",
    },
    {
      id: 5,
      title: "線上訂位",
      name: "bookingall",
      path: "/bookingall",
    },
    {
      id: 6,
      title: "線上點餐",
      name: "meal",
      path: "/meal",
    },
  ]);

  const navItems = ref([
    { text: "首頁", route: "/", icon: "mdi-home" },
    { text: "最新消息", route: "/about", icon: "mdi-new-box" },
    { text: "活動專區", route: "/activity", icon: "mdi-bullhorn-outline" },
    { text: "菜單", route: "/menu", icon: "mdi-pasta" },
    { text: "線上訂位", route: "/bookingall", icon: "mdi-seat-outline" },
    { text: "線上點餐", route: "/meal", icon: "mdi-silverware" },
  ]);

  const navDrawerItems = ref([
    { text: "首頁", route: "/", icon: "mdi-home" },
    { text: "最新消息", route: "/about", icon: "mdi-new-box" },
    { text: "活動專區", route: "/activity", icon: "mdi-bullhorn-outline" },
    { text: "菜單", route: "/menu", icon: "mdi-pasta" },
    { text: "線上訂位", route: "/bookingall", icon: "mdi-seat-outline" },
    { text: "線上點餐", route: "/meal", icon: "mdi-silverware" },
    { text: "會員中心", route: "/member", icon: "mdi-account" },
    {
      text: "線上結帳",
      route: "/checkout",
      icon: "mdi-credit-card-scan-outline",
    },
    {
      text: "登入",
      route: "/login",
      icon: "mdi-face-recognition",
    },
  ]);
  return { links, navItems, navDrawerItems };
});
