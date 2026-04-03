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
                <input type="text" v-model="form.username" class="form-control bg-light border-start-0 rounded-end-pill shadow-none" placeholder="Nhập username" required>
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
                <input type="password" v-model="form.password" class="form-control bg-light border-start-0 rounded-end-pill shadow-none" placeholder="Ít nhất 6 ký tự" required minlength="6">
              </div>
            </div>

            <button
              class="btn btn-warning w-100 rounded-pill fw-bold py-2 mb-3 shadow-sm hover-lift"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY' }}
            </button>

            <div class="text-center small">
              <span>Đã có tài khoản? </span>
              <router-link to="/login" class="text-warning fw-bold text-decoration-none">Đăng nhập</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="errorMsg" class="modal-overlay d-flex align-items-center justify-content-center">
      <div class="modal-content-custom p-4 text-center rounded-5 shadow-lg animate-zoom">
        <i class="bi bi-exclamation-triangle-fill display-1 text-danger mb-3"></i>
        <h4 class="fw-bold text-dark">Đăng ký thất bại</h4>
        <p class="text-muted">{{ errorMsg }}</p>
        <button @click="errorMsg = ''" class="btn btn-dark rounded-pill px-5 mt-3 fw-bold">THỬ LẠI</button>
      </div>
    </div>

    <div v-if="successMsg" class="modal-overlay d-flex align-items-center justify-content-center">
      <div class="modal-content-custom p-4 text-center rounded-5 shadow-lg animate-zoom">
        <i class="bi bi-check-circle-fill display-1 text-success mb-3"></i>
        <h4 class="fw-bold text-dark">Đăng ký thành công!</h4>
        <p class="text-muted">Tài khoản của bạn đã được tạo. Chào mừng đến với ShoeStore!</p>
        <button @click="goToHome" class="btn btn-warning rounded-pill px-5 mt-3 fw-bold w-100">
          VỀ TRANG CHỦ
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

const router = useRouter();

const form = ref({
  username: '',
  email: '',
  password: ''
});

const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref(false);

const handleRegister = async () => {
  if (loading.value) return;

  loading.value = true;
  errorMsg.value = '';

  try {
    const trimmedUsername = form.value.username.trim();

    // 1. Kiểm tra xem Username đã có người dùng chưa (Rất quan trọng vì bạn dùng username để đăng nhập)
    const q = query(collection(db, "users"), where("username", "==", trimmedUsername));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Tên đăng nhập này đã có người sử dụng. Vui lòng chọn tên khác!");
    }

    // 2. Tạo tài khoản trên Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.value.email,
      form.value.password
    );
    const user = userCredential.user;

    // 3. Lưu thông tin vào Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: trimmedUsername,
      email: form.value.email,
      uid: user.uid
    });

    // 4. Lưu vào LocalStorage (Đăng nhập luôn)
    localStorage.setItem('currentUser', JSON.stringify({
      username: trimmedUsername,
      email: user.email,
      uid: user.uid
    }));

    // 5. Phát tín hiệu để Navbar cập nhật (Đổi thành Avatar)
    window.dispatchEvent(new Event('auth-updated'));

    // 6. Hiển thị thông báo thành công
    successMsg.value = true;

  } catch (error) {
    console.error(error);
    // Xử lý các mã lỗi Firebase thành tiếng Việt thân thiện
    if (error.message.includes("Tên đăng nhập")) {
      errorMsg.value = error.message;
    } else if (error.code === 'auth/email-already-in-use') {
      errorMsg.value = "Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập!";
    } else if (error.code === 'auth/weak-password') {
      errorMsg.value = "Mật khẩu quá yếu. Vui lòng nhập ít nhất 6 ký tự.";
    } else if (error.code === 'auth/invalid-email') {
      errorMsg.value = "Định dạng email không hợp lệ.";
    } else if (error.code === 'auth/network-request-failed') {
      errorMsg.value = "Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền.";
    } else {
      errorMsg.value = "Đã xảy ra lỗi. Vui lòng thử lại sau!";
    }
  } finally {
    loading.value = false;
  }
};

// Hàm xử lý khi bấm nút "Về trang chủ"
const goToHome = () => {
  successMsg.value = false;
  router.push('/');
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 10000;
}

/* Modal Box */
.modal-content-custom {
  background: white;
  max-width: 400px;
  width: 90%;
}

/* Animations */
.animate-fade-in { animation: fadeInUp 0.6s ease-out; }
.animate-zoom { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

/* Tương tác */
.hover-lift { transition: all 0.3s ease; }
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4) !important;
}
.input-group-text { color: #6c757d; }
.form-control:focus { background-color: #fff !important; }
</style>
