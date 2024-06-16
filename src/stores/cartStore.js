import { defineStore } from "pinia";
import { ref, computed } from "vue";
export const useCartStore = defineStore(
  "cart",
  () => {
    const carts = ref({});
    // 添加商品到指定座位的購物車
    const addCart = (seatId, item) => {
      if (!carts.value[seatId]) {
        carts.value[seatId] = [];
      }

      const existingItemIndex = carts.value[seatId].findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex !== -1) {
        // 商品存在，增加数量
        carts.value[seatId][existingItemIndex].qty++;
      } else {
        // 商品不存在，添加新商品
        carts.value[seatId].push({ ...item, qty: 1 });
      }
    };

    // 計算指定座位的購物車總數量
    const totalQty = (seatId) =>
      computed(() => {
        return carts.value[seatId]
          ? carts.value[seatId].reduce((total, item) => total + item.qty, 0)
          : 0;
      });

    // 計算指定座位的購物車總價錢
    const totalPrice = (seatId) =>
      computed(() => {
        return carts.value[seatId]
          ? carts.value[seatId].reduce(
              (total, item) => total + item.unitPrice * item.qty,
              0
            )
          : 0;
      });

    // 移除指定座位的購物車商品
    const removeCart = (seatId, itemId) => {
      const index = carts.value[seatId].findIndex(
        (cartItem) => cartItem.id === itemId
      );
      if (index !== -1) {
        carts.value[seatId].splice(index, 1);
      }
    };

    // 清除指定座位的購物車
    const clearCart = (seatId) => {
      if (carts.value[seatId]) {
        carts.value[seatId] = [];
      }
    };

    return { carts, addCart, removeCart, totalPrice, totalQty, clearCart };
  },
  {
    persist: true, // 將狀態存到localStorage
  }
);
