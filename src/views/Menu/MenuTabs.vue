<template>
      <v-card style="background-color: lightsalmon;">
            <v-tabs v-model="tab" bg-color="black" fixed-tabs show-arrows>
                  <template v-for="category in categoryList">
                        <v-tab :value="category.id" class="text-h6">{{ category.name }}</v-tab>
                  </template>
            </v-tabs>

            <v-card-text v-if="showGroup">
                  <div v-for="[categoryName, products] in Object.entries(productGroup)" :key="categoryName"
                        class="text-h2 pa-5">
                        <div id="menuBackground">
                              {{ categoryName }}
                              <Carddialog :product-list="products"></Carddialog>
                        </div>
                  </div>
            </v-card-text>
            <v-card-text v-else>
                  <Carddialog :product-list="filteredProductList" id="menuBackground">
                  </Carddialog>
            </v-card-text>
      </v-card>
</template>
<script setup>
import { onBeforeUpdate, ref, watch } from 'vue';
import Carddialog from './Carddialog.vue'

onBeforeUpdate(() => {
      tab.value = props.tab;
      filterArray(props.productList, props.tab)
})
const tab = ref("0");
const showGroup = ref();
const filteredProductList = ref([]);
const productGroup = ref({})
const props = defineProps({
      categoryList: Array,
      productList: Array,
      tab: String,
})

const groupProduct = (list) => {
      const groupByCategory = list.reduce((groups, product) => {
            const { categoryName: categoryName } = product;
            if (!groups[categoryName]) {
                  groups[categoryName] = [];
            }
            groups[categoryName].push(product);
            return groups;
      }, {});
      return groupByCategory;
}

const filterArray = (list, newTab) => {
      if (newTab == 0) {
            productGroup.value = groupProduct(list)
            // filteredProductList.value = list;
      } else {
            filteredProductList.value = list.filter(product => {
                  product.dialog = false;
                  return product.categoryId == newTab
            });
      }
}

watch(tab, (newTab) => {
      if (newTab == 0) {
            showGroup.value = true
      } else {
            showGroup.value = false
      }
      filterArray(props.productList, newTab)
})

</script>

<style scoped>
#menuBackground {
      background-image: url('https://pic.616pic.com/bg_w1180/00/03/83/amhvNDOWIg.jpg!/fh/300');
      background-size: cover;
}

/* #menuImage{
      background-image: url('../../../public/assets/img/product/57b3ef6a-978e-4adf-a43f-1167c237df0d.jpg');
      background-size: cover;
      background-repeat: repeat-x;
} */
</style>