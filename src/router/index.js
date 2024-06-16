import { createRouter, createWebHistory } from "vue-router";
import index from "@/views/Index/Layout.vue";
import NotFound from "@/views/Notfound/NotFound.vue";

import Home from "@/views/Home/Home.vue";
import Activity from "@/views/Activity/Activity.vue";
import Menu from "@/views/Menu/Menu.vue";
import ChangeReservation from "@/views/Reservation/ChangeReservation.vue";
import Seat from "@/views/Seat/Seat.vue";
import CalendarBooking from "@/views/Seat/CalendarBooking.vue";
import BookingAll from "@/views/Seat/BookingAll.vue";
import Meal from "@/views/Meal/Meal.vue";
import Member from "@/views/Member/Member.vue";
import CheckOut from "@/views/CheckOut/Index.vue";
import EatNow from "@/views/Meal/EatNow.vue";
import Payment from "@/views/CheckOut/Payment.vue";
import Pay from "@/views/CheckOut/Pay.vue";
import Confirm from "@/views/CheckOut/Confirm.vue";
import Cancel from "@/views/CheckOut/Cancel.vue";
import Finish from "@/views/CheckOut/Finish.vue";
import About from "@/views/About/About.vue";
import Questionnaire from "@/views/Questionnaire/Questionnaire.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: index,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "/activity",
          name: "activity",
          component: Activity,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "/menu/:id?",
          name: "menu",
          component: Menu,
          props: true,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "/changereservation",
          name: "changereservation",
          component: ChangeReservation,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "/seat",
          name: "seat",
          component: Seat,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "/calendarbooking",
          name: "calendarbooking",
          component: CalendarBooking,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "/bookingall",
          name: "bookingall",
          component: BookingAll,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "/meal",
          name: "meal",
          component: Meal,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "eatNow/:seatId(\\d+)",
          name: "eatNow",
          component: EatNow,
          props: (route) => ({
            seatId: route.params.seatId,
            branchId: route.query.branchId, //傳遞店家參數
          }),
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "/checkout",
          name: "checkout",
          component: CheckOut,
          meta: {
            requireAuth: true, //要驗證
          },
          children: [
            {
              path: "",
              name: "payment",
              component: Payment,
              meta: {
                requireAuth: true, // 要驗證
              },
            },
            {
              path: "pay",
              name: "pay",
              component: Pay,
              meta: {
                requireAuth: true, //要驗證
              },
            },
            {
              path: "confirm",
              name: "confirm",
              component: Confirm,
              meta: {
                requireAuth: true, //要驗證
              },
            },
            {
              path: "cancel",
              name: "cancel",
              component: Cancel,
              meta: {
                requireAuth: true, //要驗證
              },
            },
            {
              path: "finish",
              name: "finish",
              component: Finish,
              meta: {
                requireAuth: true, //要驗證
              },
            },
          ],
        },
        {
          path: "/member",
          name: "member",
          component: Member,
          meta: {
            requireAuth: true, //要驗證
          },
        },
        {
          path: "/about",
          name: "about",
          component: About,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
        {
          path: "/questionnaire/:orderId(\\d+)",
          name: "questionnaire",
          component: Questionnaire,
          props: true,
          meta: {
            requireAuth: false, //不用驗證
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login/Login.vue"),
      meta: {
        requireAuth: false, //不用驗證
      },
    },
    {
      path: "/Register",
      name: "Register",
      component: () => import("@/views/Login/Register.vue"),
      meta: {
        requireAuth: false, //不用驗證
      },
    },
    {
      path: "/ForgotPassword",
      name: "ForgotPassword",
      component: () => import("@/views/Login/ForgotPassword.vue"),
      meta: {
        requireAuth: false, //不用驗證
      },
    },
    {
      path: "/ResetPassword",
      name: "ResetPassword",
      component: () => import("@/views/Login/ResetPassword.vue"),
      meta: {
        requireAuth: false, //不用驗證
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/Member/profile.vue"),
      meta: {
        requireAuth: false, //不用驗證
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
      meta: {
        requireAuth: false, //不用驗證
      },
    },
  ],
  //配置路由滾動行為
  scrollBehavior() {
    return { top: 0 };
  },
});

// 路由驗證
router.beforeEach((to, from) => {
  if (to.meta.requireAuth) {
    const user = localStorage.getItem("user");
    const userInfo = JSON.parse(user).userInfo;
    const token = userInfo.token;
    if (!token) {
      return { name: "login" };
    }
  }
});

export default router;
