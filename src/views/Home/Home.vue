<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from "vue"
import ItemGroup from "@/views/Home/ItemGroup.vue"
import CarouselVideo from "../Menu/CarouselVideo.vue";
import CardGuid from "../Menu/CardGuid.vue";
import { getHotProductApi } from "@/apis/hotProduct";
import { useDisplay } from "vuetify";
import IntervalCard from '../Home/IntervalCard.vue'
import { filterOption } from 'ant-design-vue/es/vc-mentions/src/util';

const hotProducts = ref([]);
const getHotProducts = async () => {
  const count = 10;
  const showtime = getNowTime();
  const days = 365;
  const res = await getHotProductApi(count, showtime, days);
  hotProducts.value = res;
}

const getNowTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const desiredFormat = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return desiredFormat;
}

const items = computed(() => {
  return hotProducts.value.map((item, index) => ({
    id: index,
    src: item.imageUrl,
  }));
});


const hotProductName = ref("熱門商品");
const categoryList = ref([])
const name = ref("分類")
const selectId = ref(0);

onMounted(async () => {
  await axios.get('https://localhost:7259/api/ProductCategories')
    .then(response => {
      categoryList.value = response.data;
    })
    .catch(error => console.log(error))
  getHotProducts();
})


</script>

<template>
  <CarouselVideo></CarouselVideo>
  <!-- <ItemGroup :items="items" v-model:model="selectId"><template #name>{{ hotProductName }}</template></ItemGroup>
-->
  <IntervalCard :hot-product-list="hotProducts"></IntervalCard>
  <!-- <Card :items="hotProducts" :nums="3">
    <template #titleName>熱銷商品</template>
    <template #textName>銷售數量:</template>
  </Card> -->


  <CardGuid :category-list="categoryList"><template #name>{{ name }}</template></CardGuid>
</template>
