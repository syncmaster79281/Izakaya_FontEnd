<template>
  <v-container class="pa-4" style="height: 100vh; display: flex; align-items: start; justify-content: center;">
    <v-card class="rounded-lg" elevation="12" height="50%" width="50%" min-width="300">
      <v-card-title class="justify-center">會員資料</v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon class="custom-icon-color">mdi-account</v-icon>
            </template>
            <v-list-item-title>{{ userInfo.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon class="custom-icon-color">mdi-email</v-icon>
            </template>
            <v-list-item-title>{{ userInfo.email }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon class="custom-icon-color">mdi-cake-variant</v-icon>
            </template>
            <v-list-item-title>{{ userInfo.birthday }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon class="custom-icon-color">mdi-phone</v-icon>
            </template>
            <v-text-field v-model="editedPhone" label="電話號碼" outlined dense class="flex-grow-1"></v-text-field>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon class="custom-icon-color">mdi-star-circle</v-icon>
            </template>
            <v-list-item-title>{{ userInfo.point }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" variant="outlined" @click="saveChanges">保存修改</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios'; // 引入axios

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const editedPhone = ref(userInfo.value.phone);

const saveChanges = async () => {
  try {
    const response = await axios.put('https://localhost:7259/api/MembersUpdate/updatephone', {
      email: userInfo.value.email,
      phone: editedPhone.value
    });
    // 更新成功，可以根据需要更新前端的状态或给用户反馈
    console.log(response.data);
    alert('電話號碼更新成功');
    userStore.updateUserInfo({ ...userInfo.value, phone: editedPhone.value });
  } catch (error) {
    console.error('電話號碼更新失敗:', error);

  }
};
</script>

<style scoped>
.custom-icon-color {
  color: #9400f7;
}
</style>