<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';

const articles = ref([]);
const loadArticle = async () => {
  try {
    const response = await axios.get('https://localhost:7259/api/Articles');
    articles.value = response.data;
    articles.value.forEach(article => {
      article.showContent = false;
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

const showArticle = computed(() => {
  return articles.value.filter(article => article.status === true); // 根据实际情况筛选
});

const truncateContent = (content, maxLength) => {
  if (content.length > maxLength) {
    return content.slice(0, maxLength) + '...';
  } else {
    return content;
  }
};

const showContent = article => {
  article.showContent = true;

};

// const showContent = (article) => {
//   return { ...article, showContent: true };
// };

// const showArticle = computed(() => {
//   return articles.value.filter(article => article.status === true);
// });

onMounted(() => {
  loadArticle();
});

</script>

<template>
  <section id="about" class="about">
    <div class="container" data-aos="fade-up">
      <div class="row">
        <div v-for="article in showArticle" :key="article.title" v-if="showArticle" class="col-lg-6 order-1 order-lg-2"
          data-aos="zoom-in" data-aos-delay="100">
          <div class="about-img col-10 mb-3">
            <img :src="`/assets/img/about/${article.imageUrl}`" alt="">
          </div>
          <div class="col-lg-10 pt-4 pt-lg-0 order-2 order-lg-1 content mb-10">
            <h3 class="h3">{{ article.title }}</h3>
            <p class="fst-italic p">{{ article.publishDate }}</p>
            <!-- <ul>
                <li><i class="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                <li><i class="bi bi-check-circle"></i> Duis aute irure dolor in reprehenderit in voluptate velit.</li>
                <li><i class="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate trideta storacalaperda mastiro dolore eu fugiat nulla pariatur.</li>
              </ul> -->
            <p class="p" v-if="!article.showContent">{{ truncateContent(article.contents, 50) }} <a href="#"
                @click.prevent="showContent(article)">閱讀更多</a></p>
            <p class="p" v-else>{{ article.contents }}</p>
          </div>
        </div>
      </div>
    </div>
  </section><!-- End About Section -->
</template>

<style scoped>
.h3 {
  color: #fff;
  /* 设置标题颜色为白色 */
}

.p {
  color: #fff;
  /* 设置段落颜色为白色 */
}
</style>