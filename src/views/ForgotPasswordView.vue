<template>
  <div class="container py-5 mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5 col-lg-4">
        <div class="card border-0 shadow-lg rounded-4 p-4 animate-fade-in">
          <div class="text-center mb-4">
            <div class="icon-box bg-warning-subtle text-warning rounded-circle d-inline-flex p-3 mb-3">
              <i class="bi bi-key-fill fs-2"></i>
            </div>
            <h2 class="fw-bold text-uppercase">Quên mật khẩu?</h2>
            <p class="text-muted small">Nhập Email đã đăng ký để nhận liên kết đặt lại mật khẩu.</p>
          </div>

          <form @submit.prevent="handleReset">
            <div class="mb-4">
              <label class="form-label small fw-bold">Địa chỉ Email</label>
              <input type="email" v-model="email" class="form-control rounded-pill bg-light py-2 shadow-none" placeholder="name@example.com" required>
            </div>

            <button class="btn btn-warning w-100 rounded-pill fw-bold py-2 mb-3 shadow-sm hover-lift" :disabled="loading">
               {{ loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU' }}
            </button>

            <div class="text-center">
              <router-link to="/login" class="text-dark small fw-bold text-decoration-none">
                <i class="bi bi-arrow-left"></i> Quay lại Đăng nhập
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="status.show" class="modal-overlay d-flex align-items-center justify-content-center">
      <div class="modal-content-custom p-4 text-center rounded-5 shadow-lg animate-zoom">
        <i :class="status.icon + ' display-1 mb-3 ' + status.color"></i>
        <h4 class="fw-bold">{{ status.title }}</h4>
        <p class="text-muted">{{ status.message }}</p>
        <button @click="status.show = false" class="btn btn-dark rounded-pill px-5 mt-2">ĐÓNG</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";

const email = ref('');
const loading = ref(false);
const status = ref({ show: false, title: '', message: '', icon: '', color: '' });

const handleReset = async () => {
  loading.value = true;
  try {
    await sendPasswordResetEmail(auth, email.value);
    status.value = {
      show: true,
      title: 'Thành công!',
      message: 'Một email khôi phục đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
      icon: 'bi bi-envelope-check-fill',
      color: 'text-success'
    };
  } catch  {
    status.value = {
      show: true,
      title: 'Lỗi',
      message: 'Email này không tồn tại trong hệ thống!',
      icon: 'bi bi-exclamation-triangle-fill',
      color: 'text-danger'
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); z-index: 10000; }
.modal-content-custom { background: white; max-width: 400px; width: 90%; }
.animate-fade-in { animation: fadeInUp 0.6s ease-out; }
.animate-zoom { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
.bg-warning-subtle { background-color: #fff3cd; }
</style>
