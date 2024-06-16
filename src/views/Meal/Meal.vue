<script setup>
import { computed, onMounted, ref, watch } from 'vue'

//el進度條 step
const e1 = ref(1)

const steps = ref([
  {
    id: 1,
    title: "選擇店家",
  },
  {
    id: 2,
    title: "選擇桌號",
  },
  {
    id: 3,
    title: "掃描QRCode",
  }
])

//取的店家資料
import { getBranchApi } from "@/apis/branch.js";
const branchList = ref([])
const getBranch = async () => {
  try {
    const res = await getBranchApi();
    branchList.value = res;
  }
  catch (error) {
    console.error("fetch getBranchApi 失敗", error);
  }
}

//掛載時取得店家資料
onMounted(() => {
  getBranch();
})


//選擇店家
const branchId = ref(0)
const selectBranch = (id) => {
  branchId.value = parseInt(id, 10);
  e1.value = 2;
}

//取得桌號資料
import { getBranchSeatApi } from "@/apis/seat.js";
const seatList = ref([])
const getSeatList = async () => {
  try {
    const res = await getBranchSeatApi(branchId.value);
    seatList.value = res;
  }
  catch (error) {
    console.error("fetch getBranchSeatApi 失敗", error);
  }
}

//監聽店家選擇 變動時取得桌號資料
watch(branchId, (currentId) => {
  if (currentId !== 0) {
    getSeatList();
  }
})

//選擇桌號
const seatId = ref(0)
const selectSeat = (id) => {
  seatId.value = parseInt(id, 10);
  e1.value = 3;
}

//產生QRCode
const qrValue = computed(() => {
  return `https://localhost:8080/eatNow/${seatId.value}?branchId=${branchId.value}`
})


// 監聽視窗尺寸變化
import { useWindowSize } from '@vueuse/core';
const { width } = useWindowSize();
const qrSize = computed(() => {
  return width.value < 960 ? 200 : width.value < 1280 ? 250 : width.value < 1920 ? 300 : width.value < 2560 ? 350 : 400;
});


//判斷是否選擇
const isSelected = ref(false);
watch(e1, (currentStep) => {
  switch (currentStep) {
    case 1:
      isSelected.value = branchId.value !== 0;
      //重置選擇桌號
      branchId.value = 0;
      seatId.value = 0;
      seatList.value = [];
      break;
    case 2:
      isSelected.value = branchId.value !== 0;
      break;
    case 3:
      isSelected.value = branchId.value !== 0 && seatId.value !== 0;
      break;
    default:
      isSelected.value = false;
  }
});
</script>

<template>
  <v-stepper v-model="e1" prev-text="上一步" next-text="下一步" alt-labels width="100%" height="800" max-width="1200"
    class="mx-auto mt-10">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header class="font-weight-bold">
        <template v-for="step in steps" :key="`${step.id}-step`">
          <v-stepper-item :complete="e1 > step.id && isSelected" :step="`Step${step.id}`" :value="step.id"
            :title="step.title" :color="e1 > step.id && isSelected ? 'green' : 'grey'" editable></v-stepper-item>
          <v-divider v-if="step.id !== steps.length" :key="step.id"></v-divider>
        </template>
      </v-stepper-header>
      <v-stepper-window>
        <v-stepper-window-item v-for="step in steps" :key="`${step.id}-content`" :value="step.id">
          <template v-if="step.title === '選擇店家'">
            <v-row class="d-flex justify-center align-center">
              <v-col cols="12" sm="6" v-for="branch of branchList" :key="branch.id">
                <v-card class="mx-auto rounded-lg mb-3" elevation="12" max-width="600">
                  <v-img
                    :src="branch.id == 1 ? 'https://i.pinimg.com/originals/08/82/7a/08827a3087ed4d03ba1bbf0ff9d7b378.jpg' : 'https://th.bing.com/th/id/R.5ba53bfbe4041accc81b69ac7492f24b?rik=DwBNB3Z%2fRNkXZg&riu=http%3a%2f%2fjintangjiang.oss-cn-beijing.aliyuncs.com%2fimages%2f74df368b785f33241a0123850e39fae0dd272b97.JPG&ehk=805ClwdZIBHrhvC1yoH5rHFuAnyozKDkoY9rT7IhImc%3d&risl=&pid=ImgRaw&r=0'"
                    class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200" cover>
                    <v-card-title class="text-white" v-text="branch.name"></v-card-title>
                  </v-img>
                  <v-card-text class="font-weight-bold">
                    <div>地址: {{ branch.address }}</div>
                    <div>電話: {{ branch.tel }}</div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark color="pink-lighten-2" icon="mdi-heart" size="small" variant="text"></v-btn>
                    <v-btn dark color="blue-grey-darken-1" icon="mdi-bookmark" size="small" variant="text"></v-btn>
                    <v-btn dark color="blue-darken-1" icon="mdi-share-variant" size="small" variant="text"></v-btn>
                    <v-btn dark color="primary rounded-pill" size="small" variant="flat" text="選擇"
                      @click="selectBranch(branch.id)"></v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
          <template v-if="step.title === '選擇桌號'">
            <v-container fluid class="pa-0 mx-auto">
              <v-row dense>
                <v-col cols="12" sm="6" md="4" lg="3" v-for="seat of seatList" :key="seat.id">
                  <v-hover v-slot="{ isHovering, props }" open-delay="100">
                    <v-btn dark size="small" variant="flat" :text="seat.name" width="100%" v-bind="props"
                      class="rounded-xl font-weight-bold"
                      :color="isHovering ? 'deep-purple-accent-3' : 'grey-lighten-3'" height="60"
                      @click="selectSeat(seat.id)"></v-btn>
                  </v-hover>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <template v-if="step.title === '掃描QRCode' && isSelected">
            <v-container fluid class="pa-0 mx-auto mt-5">
              <v-row justify-center align-center>
                <v-col cols="12" class="d-flex flex-column justify-center align-center" height="70%">
                  <a-qrcode :size="qrSize" :icon-size="qrSize / 4" error-level="H" :value="qrValue"
                    icon="/assets/img/logo/izakaya-logo-svg1.svg" />
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-stepper-window-item>
      </v-stepper-window>
    </template>
  </v-stepper>
</template>


<style scoped>
.container-hight {
  min-height: 100vh;
}
</style>
