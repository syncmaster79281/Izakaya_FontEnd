<template>
  <Tabs :category-list="categoryList" :productList="productList" :tab="props.id"></Tabs>
  <Card :items="items" :show-star="true">
    <template #titleName>人氣商品</template>
    <template #starName>評價:</template>
  </Card>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, provide } from 'vue';
import Tabs from './MenuTabs.vue'
import Card from './Card.vue'
import CardwithRank from '../Home/CardwithRank.vue';
onMounted(async () => {
  await axios.get('https://localhost:7259/api/Products')
    .then(response => {
      //console.log(response.data)
      productList.value = response.data
    })
    .catch(error => console.log(error))

  await axios.get('https://localhost:7259/api/ProductCategories')
    .then(response => {
      //console.log(response.data)
      let list = response.data
      list.unshift({ id: 0, name: "全部菜單" })
      categoryList.value = list;;
    })
    .catch(error => console.log(error))

  await axios.get('https://localhost:7259/api/Questionnaires/top5')
    .then(response => {
      // console.log(response.data)
      const productScores = response.data;
      items.value = productScores.map(score => ({
        imgUrl: score.imageUrl,
        productName: score.name,
        rating: score.averageScore
      }));
      // console.log(items.value);
    })
    .catch(error => console.log(error))
})

const props = defineProps({
  id: {
    type: String,
    default: "0",
  },
})
const productList = ref([])
provide("productList", productList)

const categoryList = ref([])
provide("categoryList", categoryList)


const items = ref([
  {
    imgUrl:
      'https://imgur.com/np3QjzJ.jpg',
    productName: '烤秋刀魚',
    rating: 5,
  },
  {
    imgUrl:
      'https://imgur.com/3qG6Hfz.jpg',
    productName: '烤牛舌',
    rating: 4.8,
  },
  {
    imgUrl:
      'https://imgur.com/TRzJJcz.jpg',
    productName: '烤牛肉串',
    rating: 4.5,
  },
  {
    imgUrl:
      'https://imgur.com/e0nfG9Y.jpg',
    productName: '鮭魚生魚片',
    rating: 4.2,
  },
  {
    imgUrl:
      'https://imgur.com/eV3MY8N.jpg',
    productName: '天使紅蝦刺身',
    rating: 4,
  },
])
</script>
