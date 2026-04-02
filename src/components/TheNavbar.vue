<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
    <div class="container">
      <router-link class="navbar-brand fw-bold fs-3" to="/" @click="handleLogoClick">
        <span class="text-warning">SHOE</span>STORE
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
            <router-link class="nav-link text-uppercase fw-semibold px-3" to="/orders">Đơn Hàng</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3">

          <router-link to="/cart" class="btn btn-outline-warning rounded-pill px-3 fw-bold position-relative">
            Giỏ hàng 🛒
            <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ cartCount }}
            </span>
          </router-link>

          <div v-if="!currentUser" class="d-flex gap-2">
            <router-link to="/login" class="btn btn-outline-light btn-sm rounded-pill px-3">
              Đăng nhập
            </router-link>
            <router-link to="/register" class="btn btn-warning btn-sm rounded-pill px-3 fw-bold">
              Đăng ký
            </router-link>
          </div>

          <div v-else class="dropdown">
            <a class="nav-link dropdown-toggle text-warning fw-bold cursor-pointer" id="userDropdown" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle"></i> {{ currentUser.username }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 rounded-3">
              <li><router-link class="dropdown-item py-2" to="/account"><i class="bi bi-person-gear"></i> Tài khoản</router-link></li>
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

const router = useRouter();
const route = useRoute();

// --- 1. KHAI BÁO CÁC BIẾN PHẢN ỨNG (REFS) ---
const cartCount = ref(0);
const currentUser = ref(null);

// --- 2. HÀM CẬP NHẬT TRẠNG THÁI TỔNG THỂ ---
// Hàm này sẽ lấy dữ liệu mới nhất từ LocalStorage để hiển thị lên Nav
const updateState = () => {
  // Cập nhật thông tin User
  const user = localStorage.getItem('currentUser');
  currentUser.value = user ? JSON.parse(user) : null;

  // Cập nhật số lượng sản phẩm trong giỏ
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartCount.value = cart.reduce((total, item) => total + item.quantity, 0);
};

// --- 3. XỬ LÝ SỰ KIỆN LOGO (CUỘN LÊN ĐẦU) ---
const handleLogoClick = (e) => {
  if (route.path === '/') {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// --- 4. ĐIỀU HƯỚNG VÀ LỌC SẢN PHẨM ---
const navFilter = (type) => {
  const query = type === 'sale' ? { filter: 'sale' } : { category: type };

  if (route.path === '/') {
    // Nếu ở trang chủ: Cập nhật URL và phát tín hiệu cuộn mượt
    router.push({ query });
    window.dispatchEvent(new CustomEvent('scroll-to-products'));
  } else {
    // Nếu ở trang khác: Về trang chủ kèm theo lệnh lọc
    router.push({ path: '/', query });
  }
};

// --- 5. XỬ LÝ ĐĂNG XUẤT ---
const handleLogout = () => {
  localStorage.removeItem('currentUser'); // Xóa dấu vết đăng nhập
  updateState(); // Cập nhật lại giao diện ngay lập tức để hiện nút Đăng nhập/Đăng ký
  router.push('/');
};

// --- 6. QUẢN LÝ VÒNG ĐỜI (LIFECYCLE) ---
onMounted(() => {
  updateState(); // Chạy ngay khi vừa load trang

  // Lắng nghe các "tín hiệu" từ các trang khác (khi đăng ký thành công hoặc thêm giỏ hàng)
  window.addEventListener('auth-updated', updateState);
  window.addEventListener('cart-updated', updateState);
});

onUnmounted(() => {
  // Dọn dẹp các sự kiện khi chuyển trang để tránh nặng máy (Memory Leak)
  window.removeEventListener('auth-updated', updateState);
  window.removeEventListener('cart-updated', updateState);
});
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}

/* Hiệu ứng nhịp tim cho nút Sale */
.pulse-animation {
  animation: pulse 2s infinite;
  display: inline-block;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Hiệu ứng hover cho các link */
.nav-link {
  transition: color 0.3s ease;
}
.nav-link:hover {
  color: #ffc107 !important;
}
</style>
