<template>
  <div class="d-flex justify-center align-center" style="background-color: black; height: 100vh; width: 100%;">
    <v-container class="pa-0" fluid>
      <v-row class="d-flex justify-center align-content-center">
        <v-col cols="12">
          <v-card class="elevation-12 rounded-lg mx-auto" max-width="500">
            <v-toolbar color="blue-accent-3" dark>
              <v-toolbar-title>註冊新帳號</v-toolbar-title>
              <v-btn :to="{ name: 'login' }" icon="mdi-arrow-left" text></v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form ref="formRef" v-model="valid">
                <v-snackbar v-model="showSnackbar" :timeout="3000" :color="snackbarColor" class="snackbar-content" top>
                  <v-icon left>mdi-alert-circle</v-icon>
                  {{ snackbarText }}
                  <template v-slot:action="{ attrs }">
                    <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false">關閉</v-btn>
                  </template>
                </v-snackbar>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="name" :rules="nameRules" label="姓名" prepend-icon="mdi-account"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="email" :rules="emailRules" label="電子郵件" prepend-icon="mdi-email"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="password" :rules="passwordRules" :type="showPassword ? 'text' : 'password'"
                        label="密碼" prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append="toggleShowPassword" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="confirmPassword" :rules="passwordConfirmRules"
                        :type="showConfirmPassword ? 'text' : 'password'" label="確認密碼" prepend-icon="mdi-lock"
                        :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append="toggleShowConfirmPassword" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="phone" :rules="phoneRules" label="電話" prepend-icon="mdi-cellphone"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="birthdayFormatted" label="生日" readonly>
                        <template v-slot:prepend>
                          <v-icon @click="showDateTimePicker">mdi-calendar</v-icon>
                        </template>
                      </v-text-field>
                      <v-dialog v-model="dateTimePickerActive" persistent max-width="290px">
                        <v-date-picker v-model="birthday" no-title scrollable
                          @update:modelValue="handleDateChange"></v-date-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="register" :disabled="!valid">提交</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const formRef = ref(null);
const router = useRouter();
const valid = ref(true);
const name = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');
const confirmPassword = ref('');
const birthday = ref(new Date());
const birthdayFormatted = computed(() => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return birthday.value.toLocaleDateString('zh-TW', options);
});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const dateTimePickerActive = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('error');

const nameRules = [v => !!v || '姓名是必填項'];
const emailRules = [v => !!v || '電子郵件是必填項', v => /.+@.+\..+/.test(v) || '電子郵件格式不正確'];
const passwordRules = [v => !!v || '密碼是必填項', v => v.length >= 6 || '密碼長度不能小於6個字符'];
const phoneRules = [v => !!v || '電話是必填項', v => /^09\d{8}$/.test(v) || '電話必須以09開頭且為10位數字'];
const passwordConfirmRules = [v => v === password.value || '密碼不一致'];

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const register = () => {
  if (formRef.value.validate()) {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('email', email.value);
    formData.append('password', password.value);
    formData.append('phone', phone.value);
    formData.append('birthday', birthday.value.toISOString());

    axios.post('https://localhost:7259/api/Register', formData)
      .then(response => {
        snackbarText.value = '註冊成功！';
        snackbarColor.value = 'green';
        showSnackbar.value = true;
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      })
      .catch(error => {
        snackbarText.value = '註冊失敗，請檢查輸入內容。';
        snackbarColor.value = 'error';
        showSnackbar.value = true;
      });
  } else {
    snackbarText.value = '請填寫所有必填欄位！';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
};

const showDateTimePicker = () => {
  dateTimePickerActive.value = true;
};

const handleDateChange = (value) => {
  birthday.value = value;
  dateTimePickerActive.value = false;
};
</script>

<style scoped>
.snackbar-content {
  font-size: 18px;
  font-weight: 500;
}

.v-snack__content {
  display: flex;
  align-items: center;
}

.snackbar-content {
  top: 50% !important;
  transform: translateY(-50%);
}
</style>
