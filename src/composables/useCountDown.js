//封裝倒計時函數
import { ref, computed } from "vue";
import dayjs from "dayjs";

export const useCountDown = () => {
  const time = ref(0);
  const startTime = ref(0);

  // 格式化時間為 mm分ss秒
  const formatTime = computed(() => {
    return dayjs.unix(time.value).format("mm分ss秒");
  });

  // 計算剩餘時間的百分比
  const percentage = computed(() => {
    const diff = time.value / startTime.value;
    return Math.ceil((1 - diff) * 100);
  });

  const start = (currentTime) => {
    time.value = currentTime;
    startTime.value = currentTime; // 記錄開始時間
    const timer = setInterval(() => {
      time.value--;
      if (time.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

  return {
    formatTime,
    percentage,
    start,
  };
};
