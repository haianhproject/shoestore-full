<template>
  <div class="container py-5 mt-5" v-if="user">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <div class="avatar-lg bg-warning d-inline-flex align-items-center justify-content-center rounded-circle mb-4" style="width: 100px; height: 100px;">
          <h1 class="mb-0 fw-bold">{{ user.username.charAt(0).toUpperCase() }}</h1>
        </div>
        <h2 class="fw-bold">{{ user.username }}</h2>
        <p class="text-muted">{{ user.email }}</p>

        <div class="card border-0 shadow-sm rounded-4 mt-5 p-4 text-start">
          <h5 class="fw-bold border-bottom pb-3 mb-3">Thông tin cá nhân</h5>
          <div class="row g-3">
            <div class="col-6 text-muted">Tên đăng nhập:</div>
            <div class="col-6 fw-bold text-end">{{ user.username }}</div>
            <div class="col-6 text-muted">Email liên kết:</div>
            <div class="col-6 fw-bold text-end">{{ user.email }}</div>
            <div class="col-6 text-muted">Ngày gia nhập:</div>
            <div class="col-6 fw-bold text-end">01/04/2026</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const user = ref(null);
onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('currentUser'));
});
</script>
