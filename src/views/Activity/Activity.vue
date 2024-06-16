<script setup>
import { getActivitiesApi } from "@/apis/activity.js";
import { ref, onMounted } from "vue";

const activities = ref([]);

const dialog = ref(false);
const selectedActivity = ref(null);

const getActivities = async () => {
  const response = await getActivitiesApi();
  //console.log(response);
  activities.value = response;
};

const showDetails = (activity) => {
  selectedActivity.value = activity;
  dialog.value = true;
};

onMounted(() => {
  getActivities();
});
</script>

<template>
  <div class="activities-list about">
    <!-- <h1 class="text-center mb-6">活動一覽</h1> -->
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="activity in activities" :key="activity.id">
        <v-card class="activity-card rounded-lg about-img" @click="showDetails(activity)">
          <v-card-title class="activity-name">{{ activity.name }}</v-card-title>
          <v-img :src="`/assets/img/activity/${activity.name}.jpg`" :alt="activity.name" class="activity-image"></v-img>
          <v-card-subtitle>{{ activity.type }}</v-card-subtitle>
          <!-- <v-card-text>{{ activity.description }}</v-card-text> -->
        </v-card>
      </v-col>
    </v-row>

    <!-- 显示活动详情的对话框 -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title>{{ selectedActivity.name }}</v-card-title>
        <v-card-text>
          <p>{{ selectedActivity.description }}</p>
          <p>開始時間: {{ selectedActivity.startTime }}</p>
          <p>結束時間: {{ selectedActivity.endTime }}</p>
          <!-- 这里可以展示更多活动的详细信息，例如时间、地点等 -->
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="dialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.activity-name {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: flex-start;
  /* 垂直向上对齐 */
}

.activities-list {
  padding: 20px;
}

.activity-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.activity-image {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  height: 180px;
  object-fit: cover;
}

.about {
  background: url("/assets/img/about/about-bg.jpg") center center;
  background-size: cover;
  position: relative;
  padding: 80px 0;
}

.about:before {
  content: "";
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}

about .about-img {
  position: relative;
  transition: 0.5s;
}

.about .about-img img {
  max-width: 100%;
  border: 4px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.about .about-img::before {
  position: absolute;
  left: 20px;
  top: 20px;
  width: 60px;
  height: 60px;
  z-index: 1;
  content: "";
  border-left: 5px solid #cda45e;
  border-top: 5px solid #cda45e;
  transition: 0.5s;
}

.about .about-img::after {
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  z-index: 2;
  content: "";
  border-right: 5px solid #cda45e;
  border-bottom: 5px solid #cda45e;
  transition: 0.5s;
}

.about .about-img:hover {
  transform: scale(1.03);
}

.about .about-img:hover::before {
  left: 10px;
  top: 10px;
}

.about .about-img:hover::after {
  right: 10px;
  bottom: 10px;
}
</style>
