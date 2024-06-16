<script setup>
import { ref } from 'vue';
import UserInfo from "@/views/Index/UserInfo.vue"
import { useNavLinkStore } from "@/stores/navlink.js"

const navStore = useNavLinkStore();

const drawer = ref(false)
const activeTab = ref(null)
const navItems = navStore.navItems;
const navDrawerItems = navStore.navDrawerItems

</script>


<template>
  <v-app-bar app color="black" dark style="height: 64px;">
    <v-app-bar-nav-icon @click="drawer = !drawer" class=" d-sm-none d-flex"></v-app-bar-nav-icon>
    <v-toolbar-title class="custom-title">Izakaya</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tabs v-model="activeTab" background-color="black" dark show-arrows class="d-sm-flex d-none">
      <v-tab v-for="(item, index) in navItems" :key="index" :to="item.route" exact>
        {{ item.text }}
      </v-tab>
    </v-tabs>
    <v-spacer></v-spacer>
    <UserInfo class="me-5" />
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" app color="black" class="d-flex d-sm-none">
    <v-list>
      <v-list-item v-for="(item, index) in navDrawerItems" :key="index" :to="item.route" :prepend-icon="item.icon"
        :title="item.text" exact>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.custom-title {
  font-size: 24px;
  font-weight: bold;
  color: rgb(245, 208, 0)
}
</style>