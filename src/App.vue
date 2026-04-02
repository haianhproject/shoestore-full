<template>
  <div class="d-flex flex-column min-vh-100">
    <TheNavbar />

    <main class="flex-grow-1">
      <router-view />
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
// Nhúng 2 component vào App.vue
import TheNavbar from './components/TheNavbar.vue';
import TheFooter from './components/TheFooter.vue';
</script>

<style>

/* CSS Reset cơ bản để chữ mượt hơn */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #f8f9fa;
}

/* Đảm bảo trang web luôn chiếm ít nhất 100% chiều cao màn hình để Footer không bị giật lên trên */
.min-vh-100 {
  min-height: 100vh;
}
.flex-grow-1 {
  flex-grow: 1;
}
html {
  scroll-behavior: smooth !important;
}
</style>
