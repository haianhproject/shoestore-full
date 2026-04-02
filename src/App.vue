<template>
  <div class="app-container">
    <TheNavbar />

    <main class="content-wrapper">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import TheNavbar from './components/TheNavbar.vue';
import TheFooter from './components/TheFooter.vue';
</script>

<style>
/* Font chữ chuyên nghiệp */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

:root {
  --primary-color: #ffc107; /* Màu vàng đặc trưng của bạn */
  --bg-color: #f8f9fa;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-color);
  color: #1a1a1a;
  margin: 0;
}

/* Hiệu ứng chuyển trang */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content-wrapper {
  min-height: 80vh;
}
</style>
