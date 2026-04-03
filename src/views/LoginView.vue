<template>
  <div class="container py-5 mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5 col-lg-4">
        <div class="card border-0 shadow-lg rounded-4 p-4 animate-fade-in">
          <div class="text-center mb-4">
            <h2 class="fw-bold text-uppercase">Đăng Nhập</h2>
            <p class="text-muted small">Mừng bạn trở lại với <span class="text-warning fw-bold">SHOE STORE</span></p>
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label small fw-bold">Tên đăng nhập</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 rounded-start-pill text-secondary">
                  <i class="bi bi-person-circle"></i>
                </span>
                <input type="text" v-model="username" class="form-control bg-light border-start-0 rounded-end-pill shadow-none" placeholder="Nhập username của bạn" required>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold">Mật khẩu</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 rounded-start-pill text-secondary">
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control bg-light border-x-0 shadow-none" placeholder="••••••••" required>
                <span class="input-group-text bg-light border-start-0 rounded-end-pill cursor-pointer text-secondary" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </span>
              </div>
            </div>

            <div class="text-end mb-4">
              <router-link to="/forgot-password" class="text-warning small fw-bold text-decoration-none">Quên mật khẩu?</router-link>
            </div>

            <button class="btn btn-warning w-100 rounded-pill fw-bold py-2 mb-3 shadow-sm hover-lift" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP' }}
            </button>

            <div class="text-center small">
              <span>Chưa có tài khoản? </span>
              <router-link to="/register" class="text-warning fw-bold text-decoration-none">Đăng ký ngay</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="errorMsg" class="modal-overlay d-flex align-items-center justify-content-center">
      <div class="modal-content-custom p-4 text-center rounded-5 shadow-lg animate-zoom">
        <i class="bi bi-exclamation-triangle-fill display-1 text-danger mb-3"></i>
        <h4 class="fw-bold text-dark">Đăng nhập thất bại</h4>
        <p class="text-muted">{{ errorMsg }}</p>
        <button @click="errorMsg = ''" class="btn btn-dark rounded-pill px-5 mt-3 fw-bold">ĐÓNG</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  if (loading.value) return;

  loading.value = true;
  errorMsg.value = '';

  try {
    const q = query(collection(db, "users"), where("username", "==", username.value.trim()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) throw new Error("Tên đăng nhập này không tồn tại!");

    const userData = querySnapshot.docs[0].data();
    const email = userData.email;
    const role = userData.role || 'user'; // LẤY ROLE TỪ FIREBASE (Mặc định là user)

    const userCredential = await signInWithEmailAndPassword(auth, email, password.value);
    const user = userCredential.user;

    // LƯU THÊM ROLE VÀO LOCALSTORAGE
    localStorage.setItem('currentUser', JSON.stringify({
      username: userData.username,
      email: user.email,
      uid: user.uid,
      role: role
    }));

    window.dispatchEvent(new Event('auth-updated'));

    // ĐIỀU HƯỚNG THÔNG MINH
    if (role === 'admin') {
      router.push('/admin'); // NẾU LÀ ADMIN -> VÀO TRANG QUẢN LÝ
    } else {
      router.push('/'); // KHÁCH THƯỜNG -> VỀ TRANG CHỦ
    }

  } catch (error) {
    if (error.message === "Tên đăng nhập này không tồn tại!") {
      errorMsg.value = error.message;
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMsg.value = "Mật khẩu bạn nhập không chính xác.";
    } else {
      errorMsg.value = "Đã xảy ra lỗi. Vui lòng thử lại sau!";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); z-index: 10000; }
.modal-content-custom { background: white; max-width: 400px; width: 90%; }
.animate-fade-in { animation: fadeInUp 0.6s ease-out; }
.animate-zoom { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
.cursor-pointer { cursor: pointer; }
.hover-lift { transition: all 0.3s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3) !important; }
.input-group-text { border: none; font-size: 1.2rem; }
.form-control { border: none; padding: 10px 15px; }
.form-control:focus { background-color: #fff !important; }
</style>
