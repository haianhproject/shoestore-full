<template>
  <div class="container py-5 mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card border-0 shadow-lg rounded-4 p-4 animate-fade-in">
          <div class="text-center mb-4">
            <h2 class="fw-bold text-uppercase">Tạo Tài Khoản</h2>
            <p class="text-muted small">Đăng ký để nhận nhiều ưu đãi từ ShoeStore</p>
          </div>

          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label small fw-bold">Tên đăng nhập</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 rounded-start-pill"><i class="bi bi-person"></i></span>
                <input type="text" v-model="form.username" class="form-control bg-light border-start-0 rounded-end-pill shadow-none" placeholder="Username" required>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold">Email</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 rounded-start-pill"><i class="bi bi-envelope"></i></span>
                <input type="email" v-model="form.email" class="form-control bg-light border-start-0 rounded-end-pill shadow-none" placeholder="email@example.com" required>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label small fw-bold">Mật khẩu</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 rounded-start-pill"><i class="bi bi-lock"></i></span>
                <input type="password" v-model="form.password" class="form-control bg-light border-start-0 rounded-end-pill shadow-none" placeholder="••••••••" required>
              </div>
            </div>

            <button class="btn btn-warning w-100 rounded-pill fw-bold py-2 mb-3 shadow-sm hover-lift">
              ĐĂNG KÝ NGAY
            </button>

            <div class="text-center small">
              <span>Đã có tài khoản? </span>
              <router-link to="/login" class="text-warning fw-bold text-decoration-none">Đăng nhập</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; // THÊM DÒNG NÀY
import { useRouter } from 'vue-router'; // THÊM DÒNG NÀY
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const router = useRouter(); // KHỞI TẠO ROUTER

// KHAI BÁO BIẾN FORM ĐỂ V-MODEL CÓ THỂ DÙNG ĐƯỢC
const form = ref({
  username: '',
  email: '',
  password: ''
});

const handleRegister = async () => {
  try {
    // 1. Tạo tài khoản (Sửa từ email.value thành form.value.email)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.value.email,
      form.value.password
    );
    const user = userCredential.user;

    // 2. Lưu vào Firestore (Sửa từ username.value thành form.value.username)
    await setDoc(doc(db, "users", user.uid), {
      username: form.value.username,
      email: form.value.email,
      uid: user.uid
    });

    alert("🎉 Đăng ký thành công!");
    router.push('/login');
  } catch (error) {
    console.error(error);
    alert("Lỗi: " + error.message);
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeInUp 0.6s ease-out; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.hover-lift { transition: all 0.3s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4) !important; }
.input-group-text { color: #6c757d; }
.form-control:focus { background-color: #fff !important; }
</style>
