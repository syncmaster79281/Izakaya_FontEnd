import { defineStore } from "pinia";
import { ref } from "vue";
import { getOrderDataApi } from "@/apis/pay.js";
export const usePaymentStore = defineStore(
  "payment",
  () => {
    const orderDetail = ref({});
    const combinedOrderId = ref("");
    const memberId = ref("");
    const paymentTime = ref("");
    const paymentConfirmDto = ref({});
    const bestDiscount = ref({});

    const getOrderData = async () => {
      try {
        const res = await getOrderDataApi(combinedOrderId.value);
        if (res && res.packages) {
          res.packages = res.packages.filter(
            (packageItem) => packageItem.amount !== 0
          );
        }
        orderDetail.value = res;
      } catch (error) {
        console.log("error", error);
      }
    };

    const clearData = () => {
      orderDetail.value = {};
      combinedOrderId.value = "";
      memberId.value = "";
      paymentTime.value = "";
      paymentConfirmDto.value = {};
      bestDiscount.value = {};
    };

    return {
      orderDetail,
      combinedOrderId,
      memberId,
      paymentTime,
      getOrderData,
      paymentConfirmDto,
      bestDiscount,
      clearData,
    };
  },
  {
    persist: true, // 將狀態存到localStorage
  }
);
