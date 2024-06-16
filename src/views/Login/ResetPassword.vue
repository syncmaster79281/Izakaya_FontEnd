<template>
  <v-app>
    <v-container fill-height>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12" outlined>
            <v-toolbar color="black accent-4" dark flat>
              <v-toolbar-title>重製密碼</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="authCode"
                  label="認證碼"
                  prepend-icon="mdi-lock-reset"
                  type="text"
                  required
                  solo
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  label="電子信箱地址"
                  prepend-icon="mdi-email"
                  type="email"
                  :rules="emailRules"
                  required
                  solo
                ></v-text-field>
                <v-text-field
                  v-model="newPassword"
                  label="新密碼"
                  prepend-icon="mdi-form-textbox-password"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="toggleShowPassword"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="passwordRules"
                  required
                  solo
                ></v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  label="確認新密碼"
                  prepend-icon="mdi-form-textbox-password"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="toggleShowPassword"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="confirmPasswordRules"
                  required
                  solo
                ></v-text-field>
                <v-btn :disabled="!valid" color="success" class="mr-4" @click="resetPassword" block>
                  確認重製密碼
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'; 

export default {
  data() {
    return {
      authCode: '',
      email: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      valid: true,
      emailRules: [
        v => !!v || 'E-mail 是必填的',
        v => /.+@.+/.test(v) || 'E-mail 必須是有效的',
      ],
      passwordRules: [
        v => !!v || '密碼是必填的',
      ],
      confirmPasswordRules: [
        v => !!v || '確認密碼是必填的',
        v => v === this.newPassword || '密碼不匹配',
      ],
    };
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    async resetPassword() {
  if (!this.$refs.form.validate()) {
    return; 
  }
  
  try {
    
    axios.post('https://localhost:7259/api/ForgotPassword/ResetPassword', {
  token: this.authCode,
  email: this.email,
  newPassword: this.newPassword
}, {
  headers: {
    'Content-Type': 'application/json'
  }
})

    alert('密碼重設成功，請使用新密碼登入。');
    this.$router.push('/login');
  } catch (error) {
  if (error.response && error.response.data && error.response.data.message) {
    alert('密碼重設失敗：' + error.response.data.message);
  } else {
    alert('密碼重設失敗，请检查您的网络连接或稍后再试。');
  }
}
},
  },
};
</script>
