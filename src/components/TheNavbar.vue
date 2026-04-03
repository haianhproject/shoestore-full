<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center" @click="handleLogoClick">
        <div class="logo-wrapper me-2">
          <i class="bi bi-lightning-charge-fill text-warning fs-2"></i>
        </div>
        <span class="brand-text">
          V-<span class="text-warning">STRIDE</span>
        </span>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <a class="nav-link text-uppercase fw-semibold px-3 cursor-pointer" @click.prevent="navFilter('Nam')">Giày Nam</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-uppercase fw-semibold px-3 cursor-pointer" @click.prevent="navFilter('Nữ')">Giày Nữ</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-uppercase fw-bold px-3 text-danger pulse-animation cursor-pointer" @click.prevent="navFilter('sale')">🔥 SALE 50%</a>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-uppercase fw-semibold px-3" to="/orders" @click="scrollToTop">Đơn Hàng</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3">

          <router-link to="/cart" class="btn btn-outline-warning rounded-pill px-3 fw-bold position-relative" @click="scrollToTop">
            Giỏ hàng 🛒
            <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ cartCount }}
            </span>
          </router-link>

          <div v-if="!currentUser" class="d-flex gap-2">
            <router-link to="/login" class="btn btn-outline-light btn-sm rounded-pill px-3" @click="scrollToTop">
              Đăng nhập
            </router-link>
            <router-link to="/register" class="btn btn-warning btn-sm rounded-pill px-3 fw-bold" @click="scrollToTop">
              Đăng ký
            </router-link>
          </div>

          <div v-else class="dropdown">
            <a class="nav-link dropdown-toggle text-warning fw-bold cursor-pointer" id="userDropdown" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle"></i> {{ currentUser.username }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 rounded-3">
              <li><router-link class="dropdown-item py-2" to="/account" @click="scrollToTop"><i class="bi bi-person-gear"></i> Tài khoản</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item py-2 text-danger cursor-pointer" @click.prevent="handleLogout"><i class="bi bi-box-arrow-right"></i> Đăng xuất</a></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// 1. IMPORT THÊM FIREBASE
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const router = useRouter();
const route = useRoute();

const cartCount = ref(0);
const currentUser = ref(null);
let unsubscribeCart = null; // Biến lưu trữ hàm hủy lắng nghe Firebase

// --- HÀM CUỘN LÊN ĐẦU TRANG ---
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleLogoClick = (e) => {
  if (route.path === '/') {
    e.preventDefault();
    scrollToTop();
  }
};

const navFilter = (type) => {
  const query = type === 'sale' ? { filter: 'sale' } : { category: type };
  if (route.path === '/') {
    router.push({ query });
    window.dispatchEvent(new CustomEvent('scroll-to-products'));
  } else {
    router.push({ path: '/', query });
  }
};

const handleLogout = async () => {
  try {
    await auth.signOut();
    localStorage.removeItem('currentUser');
    currentUser.value = null;
    cartCount.value = 0; // Reset giỏ hàng
    if (unsubscribeCart) {
      unsubscribeCart(); // Ngừng lắng nghe giỏ hàng khi đăng xuất
    }
    router.push('/');
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
};

// --- QUẢN LÝ TRẠNG THÁI & LẮNG NGHE FIREBASE THỜI GIAN THỰC ---
onMounted(() => {
  // Lấy User từ LocalStorage để hiển thị ngay lập tức (chống giật UI)
  const localUser = localStorage.getItem('currentUser');
  if (localUser) {
    currentUser.value = JSON.parse(localUser);
  }

  // Lắng nghe sự thay đổi trạng thái đăng nhập từ Firebase
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Cập nhật lại thông tin User chính xác từ Firebase
      currentUser.value = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || user.email.split('@')[0]
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value));

      // LẮNG NGHE GIỎ HÀNG THỜI GIAN THỰC (REALTIME)
      const cartQuery = query(collection(db, 'carts'), where('userId', '==', user.uid));

      // onSnapshot sẽ tự động chạy lại mỗi khi dữ liệu 'carts' của user này trên Firebase thay đổi
      unsubscribeCart = onSnapshot(cartQuery, (snapshot) => {
        let totalQty = 0;
        snapshot.forEach((doc) => {
          // Tính tổng quantity của tất cả sản phẩm trong giỏ
          totalQty += doc.data().quantity;
        });
        cartCount.value = totalQty;
      });

    } else {
      currentUser.value = null;
      cartCount.value = 0;
      localStorage.removeItem('currentUser');
      if (unsubscribeCart) {
        unsubscribeCart();
      }
    }
  });
});

onUnmounted(() => {
  // Dọn dẹp listener khi component bị hủy
  if (unsubscribeCart) {
    unsubscribeCart();
  }
});
</script>

<style scoped>
/* Giữ nguyên toàn bộ CSS cũ của bạn */
.cursor-pointer { cursor: pointer; }
.pulse-animation { animation: pulse 2s infinite; display: inline-block; }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
.nav-link { transition: color 0.3s ease; }
.nav-link:hover { color: #ffc107 !important; }
.navbar { border-bottom: 1px solid #333; }
.logo-wrapper i, .brand-text {
  background: linear-gradient(to right, #fff 20%, #ffc107 40%, #ffc107 60%, #fff 80%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s linear infinite;
  display: inline-block;
  transition: all 0.3s ease;
}
.brand-text { font-size: 1.8rem; font-weight: 900; letter-spacing: -1.5px; text-transform: uppercase; }
.logo-wrapper i { font-size: 2.2rem; margin-right: 8px; }
.navbar-brand:hover .brand-text, .navbar-brand:hover .logo-wrapper i {
  filter: drop-shadow(0 0 12px rgba(255, 193, 7, 0.8));
  transform: scale(1.05);
}
@keyframes shine { to { background-position: 200% center; } }
.logo-wrapper { display: flex; align-items: center; justify-content: center; }
</style>
