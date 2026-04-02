<template>
  <div class="app-container d-flex flex-column min-vh-100">

    <TheNavbar />

    <main class="flex-grow-1">
      <router-view v-slot="{ Component, route }">
        <transition name="slide" mode="out-in">
          <component :is="Component" :key="route.path" />
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
/* --- 1. CÀI ĐẶT CHUNG (GLOBAL) --- */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

:root {
  --primary-color: #ffc107; /* Màu vàng thương hiệu */
  --dark-color: #1a1a1a;
  --bg-light: #f8f9fa;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #ffffff; /* Để nền trắng cho sạch sẽ */
  color: var(--dark-color);
  margin: 0;
  overflow-x: hidden; /* Chống bị vỡ layout ngang khi chạy animation */
}

/* --- 2. HIỆU ỨNG CHUYỂN TRANG (SLIDE ANIMATION) --- */
/* Trượt từ phải sang trái và mờ dần */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* --- 3. LAYOUT HELPER --- */
.flex-grow-1 {
  flex-grow: 1;
}

/* Đảm bảo nội dung không bị dính sát vào Header */
main {
  min-height: 80vh;
  padding-top: 10px;
}

/* Tùy chỉnh thanh cuộn cho đẹp */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #ffc107;
  border-radius: 10px;
}

</style>
