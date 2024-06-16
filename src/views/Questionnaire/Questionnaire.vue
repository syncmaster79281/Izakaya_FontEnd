<style scoped>
.intro-paragraph {
  font-style: italic;
  font-size: 16px;
  padding-left: 20%;
  padding-right: 10%;
  color: white;
}

.question-heading {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
  color: white;
}

.sub-heading {
  font-style: italic;
  font-size: 16px;
  color: white;
}

h1 {
  font-size: 40px;
  margin-bottom: 50px;
  margin-top: 50px;
  color: white;
}

html,
body,
.container,
.row {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: black;
}

.container {
  max-width: flex;
  max-width: 2000px;
  background-color: black;
}

button {
  font-size: 16px;
}

.button-container {
  text-align: center;
  color: #F5d000;
}

/* .half {
        position: fixed; 
        margin: 0;
        width: 35% !important;
        height: 100%;
      } */
.bg {
  background: url('https://images.unsplash.com/photo-1663511174142-6b9e3f9318a9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fGl6YWtheWF8ZW58MHx8MHx8fDA%3D') center center;
  background-size: cover;
  height: 100%;
  width: 35%;
}

.form {
  /* left: 50%; */
  /* overflow: auto; */
  /* display: flex;  */
  /* justify-content: center; */
  align-items: center;
  /* flex-wrap: wrap; */
  width: 65%;
  /* margin: 0 ; */
  /* background: linear-gradient(to right, #0c0c3d, #07034d); */
  background-color: black;
}

h1,
form {
  width: 100%;
}

h1 {
  padding-top: 0;
  text-align: center;
  color: white;
}

form {
  margin-right: auto;
  margin-left: auto;
  max-width: 500px;
}

.input-group {
  margin-bottom: 80px;
  /* display: flex; 
        align-items: center;  */
}

.input-group label {
  margin-right: 40px;
  line-height: 4;
  color: white;
}

.radio-group label {
  display: inline-block;
  color: white;
}

/* textarea {
        min-height: 150px;
      } */

.card-container {
  padding-top: 20px;
  padding-left: 30px;
}

.form.h1 {
  margin-bottom: 50px;
}

.h5 {
  padding-top: 60px;
  margin-bottom: 70px;
  color: white;
}

.form .input-group {
  margin-bottom: 20px;
}

.v-input {
  line-height: 3;
  color: white;
}

.v-radio-group {
  margin-right: 10px;
  margin-bottom: 5px;
}

.v-card {
  overflow: visible !important;
  background-color: black;
  border-color: white !important;
  color: white;
}


@media screen and (max-width: 1024px) {

  /* .half {
          position: static;
          width: 100% !important;
          height: auto;
        } */
  .bg {
    height: 30vh;
  }

  form {
    padding-right: 12px;
    padding-left: 12px;
  }
}
</style>

<template>
  <div class="container">
    <main class="row">
      <!-- bg -->
      <section class="bg"></section>
      <!-- form -->
      <main class="form">
        <h1><strong>問卷調查</strong></h1>
        <p class="intro-paragraph mb-6">親愛的顧客，您的意見對我們極為重要，請您撥冗填寫以下問卷，讓我們為您帶來更出色的饗宴。</p>

        <form @submit.prevent="submitForm">
          <div class="form-section">
            <!--訂單編號 -->
            <div class="input-group">
              <label for="textarea">訂單編號:</label>
              <v-text-field v-model="localOrderId" label="Order Id" density="compact" readonly></v-text-field>
            </div>
            <p class="question-heading">請根據實際體驗，選擇以下菜品的滿意程度：</p>
            <h4 class="sub-heading mb-4">評分範圍由最不滿意到最滿意</h4>
            <!-- 餐點評分 -->
            <v-card color="indigo" variant="outlined" v-for="(category, index) in categoriesWithOrders" :key="index"
              class="mb-10 card-container">
              <h5 class="mb-6" style="color:#F5D000;"><strong>餐點滿意程度 - {{ category }}</strong></h5>
              <div v-for="(item, indexItem) in filteredProducts(category)" :key="indexItem">
                <div class="input-group">
                  <v-radio-group inline v-model="selectedSatisfaction[category][item.id]">
                    <div style="width: auto; display: inline-block; padding: bottom 5px;">{{ item.name }}</div>
                    <v-radio v-for="i in 5" :key="i" :label="`${i}`" :value="i"></v-radio>
                  </v-radio-group>
                </div>
              </div>
            </v-card>

            <!-- 最喜歡 -->
            <div class="input-group">
              <p class="question-heading">請選擇您在本次用餐中最喜愛的餐點：</p>
              <div class="input-group">
                <label for="favoriteDish">您的最愛：</label>
                <v-select v-model="favoriteDish" :items="favoriteDishes" density="comfortable" label="Select"
                  clearable></v-select>
              </div>
            </div>
            <div class="button-container mb-8">
              <v-btn type="submit" variant="outlined">提交問卷</v-btn>
            </div>
          </div>
        </form>
        <div class="end-note">
          <!-- 表單結尾說明 -->
          <p class="intro-paragraph">再次感謝您的參與！您寶貴的意見將成為我們進步的動力，讓每位顧客都能享受最佳體驗。</p>
          <p class="intro-paragraph">如果您對我們的服務或菜品有任何建議，請隨時與我們聯繫。我們期待您的再次光臨！</p>
        </div>
      </main>
    </main>
  </div>
</template>


<script setup>
import axios from 'axios';
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();

const product = ref([]);
const selectedSatisfaction = ref({});
const favoriteDish = ref('');
const favoriteDishes = ref([]);
const orderId = ref([]);

const localOrderId = ref('');
watch(() => route.params.orderId, (newValue) => {
  localOrderId.value = newValue;
}, {
  immediate: true,
});

//取得產品列表
const getProduct = async () => {
  try {
    const response = await axios.get('https://localhost:7259/api/Products');
    product.value = response.data.map(item => ({ id: item.id, name: item.name, categoryName: item.categoryName }));
    // console.log(product.value);

    product.value.forEach(item => {
      if (!selectedSatisfaction.value[item.categoryName]) {
        selectedSatisfaction.value[item.categoryName] = {};
      }
      selectedSatisfaction.value[item.categoryName][item.id] = null;
    });
    //console.log(selectedSatisfaction.value);
  } catch (error) {
    console.error('Error', error)
  }
}

// 尋找category
const categories = computed(() => [...new Set(product.value.map(item => item.categoryName))]);
// console.log(categories);

// 根據 category 篩選產品
const filteredProducts = (category) => {
  const productsInCategory = product.value.filter(item => item.categoryName === category);
  // console.log('Category:', category);
  // console.log('Product:',product.value);

  // Return only products that are in the orderId (i.e., products that have been ordered)
  return productsInCategory.filter(item => orderId.value.includes(item.name));
}

const getOrderId = async () => {
  try {
    const response = await axios.get(`https://localhost:7259/api/OrderPayments/GetPaymentList/${localOrderId.value}`)
    const productSelect = new Set(response.data.packages.flatMap(packages => packages.products.map(product => product.name)));
    orderId.value = [...productSelect];
    favoriteDishes.value = orderId.value;

    //console.log(orderId.value);
    //console.log(favoriteDishes.value);

  } catch (error) {
    console.log('Error', error)
  }
}

onMounted(async () => {
  await getProduct();
  await getOrderId();
});

watch(orderId, (newValue) => {
  favoriteDishes.value = newValue;
});

const categoriesWithOrders = computed(() => {
  return categories.value.filter(category => {
    return filteredProducts(category).length > 0;
  });
});

const submitForm = async () => {
  try {
    // 將 JSON 數據轉換為 SelectedSatisfaction
    const selectedSatisfactionData = Object.entries(selectedSatisfaction.value).flatMap(([dishType, satisfactionData]) => {
      return Object.entries(satisfactionData)
        .filter(([productId, satisfactionLevel]) => satisfactionLevel !== null)
        .map(([productId, satisfactionLevel]) => {
          return {
            DishType: dishType,
            ProductId: parseInt(productId),
            SatisfactionLevel: satisfactionLevel.toString()
          };
        });
    });

    // console.log(selectedSatisfactionData);
    // 構建表單數據
    const formData = {
      SelectedSatisfaction: selectedSatisfactionData,
      FavoriteDish: favoriteDish.value,
      orderId: parseInt(localOrderId.value)
    };

    // 發送 post 給後端
    try {
      const response = await axios.post('https://localhost:7259/api/Questionnaires/submitForm', formData);
      // console.log('表單提交成功', response.data);
      message.success('問券已完成');
      const timer = setTimeout(() => {
        router.push({ name: 'payment' }).then(() => {
          clearTimeout(timer);
        });
      }, 1000);
    } catch (error) {
      // console.log('表單提交失敗', error);
      message.error('問券尚未完成');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

message.config({
  top: '250px',
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: 'my-message',
});

</script>