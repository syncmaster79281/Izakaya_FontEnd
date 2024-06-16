<template>
  <v-app class="background">
    <v-main fill-height class="d-flex justify-center align-center background">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12" outlined>
            <v-toolbar color="blue-accent-3" dark flat>
              <v-toolbar-title>忘記密碼</v-toolbar-title>
              <v-btn :to="{ name: 'login' }" icon="mdi-arrow-left" variant="text"></v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field v-model="email" label="請輸入您的電子郵件地址" prepend-icon="mdi-email" type="email"
                  :rules="emailRules" required solo></v-text-field>
                <v-btn :disabled="!isValidEmail" color="success" class="mr-4" @click="sendResetEmail" block>
                  發送驗證信
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      emailRules: [
        v => !!v || 'E-mail 是必填的',
        v => /.+@.+/.test(v) || 'E-mail 必需是有效的',
      ],
    };
  },
  computed: {
    isValidEmail() {
      return this.emailRules.every(rule => rule(this.email) === true);
    },
  },
  methods: {
    async sendResetEmail() {
      if (!this.isValidEmail) {
        return;
      }

      try {
        // 发送 POST 请求到后端 API
        await axios.post('https://localhost:7259/api/ForgotPassword', {
          email: this.email, // 请求体中包含用户输入的电子邮件地址
        });
        this.$emit('email-sent', this.email);
        alert(`重置密碼的信件已發送到: ${this.email}`);
      } catch (error) {
        console.error('發送重置密碼信件失敗:', error);

        alert('發送重置密碼信件失敗，請稍後重試。');
      }
    },
  },
};
</script>

<style scoped>
.v-toolbar {
  border-radius: 0 0 25px 25px;
}

.background {
  background: linear-gradient(to right, #000000, #000000);
}
</style>