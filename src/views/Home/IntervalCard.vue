<template>
  <div class="text-h4 text-white pa-5" style="background-color: black;">
    <slot name="name">熱銷商品</slot>
  </div>
  <div id="cardCarousel" class="d-flex">
    <v-row style="width: 100%;height:100% ; background-color: black;">
      <template v-for="product in filterList">
        <CardRank v-bind="product"></CardRank>
      </template>
    </v-row>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, onBeforeUpdate, ref } from 'vue'
import CardRank from '../Home/CardwithRank.vue'

const props = defineProps({
  hotProductList: Array,
})
let intervalCard;
const filterList = ref([]);

onMounted(() => {
  intervalCard = setInterval(() => {
    moveImages()
  }, 3000)

})
onBeforeUpdate(() => {
  filterHotProductList(props.hotProductList);
})
onUnmounted(() => {
  clearInterval(intervalCard)
})


const moveImages = () => {
  const firstCard = filterList.value.shift()
  filterList.value.push(firstCard)
}

const filterHotProductList = (list) => {
  let count = 1;
  filterList.value = list.filter(product => {
    product.rank = count;
    count++;
    return product;
  })
}

</script>

<style scoped>
#cardCarousel {
  width: 4000px;
  /* 調整容器寬度根據您的需要 */
  overflow: hidden;
  white-space: nowrap;
}

.image {
  display: inline-block;
  margin-right: 20px;
  /* 調整圖片之間的間距根據您的需要 */
  transition: transform 1s ease;
  /* 使用過渡效果使圖片平滑移動 */
}
</style>
