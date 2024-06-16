<script setup>
import { ref } from 'vue';
const text = ref('https://www.ispan.com.tw/');

const mainLinks = [
  {
    id: 1,
    text: '關於我們',
    path: '/home',
    name: 'home',
  },
  {
    id: 2,
    text: '線上訂位',
    path: '/bookingall',
    name: 'bookingall',
  },
  {
    id: 3,
    text: '菜單介紹',
    path: '/menu',
    name: 'menu',
  },
  {
    id: 4,
    text: '會員中心',
    path: '/member',
    name: 'member',
  },
  {
    id: 5,
    text: '活動專區',
    path: '/activity',
    name: 'activity',
  },
]
const subLinks = [
  {
    id: 1,
    text: '最新消息',
    path: '/home',
    name: 'home',
  },
  {
    id: 2,
    text: '分店資訊',
    path: '/home',
    name: 'home',
  },
  {
    id: 3,
    text: '聯絡我們',
    path: '/home',
    name: 'home',
  },
  {
    id: 4,
    text: '徵才資訊',
    path: '/home',
    name: 'home',
  },
  {
    id: 5,
    text: '常見問題',
    path: '/home',
    name: 'home',
  },
]
</script>

<template>
  <footer id="footer">
    <div class="footer-top">
      <div class="container ">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="footer-info">
              <h3>Izakaya</h3>
              <div class="row">
                <div class="col-6">
                  <p>
                    地址 : 台北市復興南路一段390號2樓<br>
                    (大安捷運站4號、6號出口)<br>
                  </p>
                  <strong>電話:</strong>(02) 6631-6588<br>
                </div>
                <div class="col-6">
                  <strong>官網:</strong> https://www.ispan.com.tw/<br>
                  <div class="social-links mt-3">
                    <a href="https://twitter.com/" class="twitter"><i class="bx bxl-twitter"></i></a>
                    <a href="https://www.facebook.com/" class="facebook"><i class="bx bxl-facebook"></i></a>
                    <a href="https://www.instagram.com/" class="instagram"><i class="bx bxl-instagram"></i></a>
                    <a href="https://www.skype.com/" class="google-plus"><i class="bx bxl-skype"></i></a>
                    <a href="https://www.linkedin.com/" class="linkedin"><i class="bx bxl-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 footer-links">
            <h4>常用連結</h4>
            <div class="row">
              <div class="col-6">
                <ul>
                  <li v-for="link in mainLinks" :key="link.id">
                    <i class="bx bx-chevron-right"></i>
                    <router-link :to="{ name: link.name }">{{ link.text }}</router-link>
                  </li>
                </ul>
              </div>
              <div class="col-6">
                <ul>
                  <li v-for="link in subLinks" :key="link.id">
                    <i class="bx bx-chevron-right"></i>
                    <router-link :to="{ name: link.name }">{{ link.text }}</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 footer-links">
            <h4>聯絡我們</h4>
            <div class="row">
              <a-space direction="vertical" align="center">
                <a-qrcode :value="text" color="#FFF" />
              </a-space>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="copyright">
        &copy; Copyright <strong><span>{{ new Date().getFullYear() }} 資展國際</span></strong>
      </div>
    </div>
  </footer>
</template>