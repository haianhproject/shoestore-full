<template>
  <footer class="bg-dark text-white pt-5 pb-3 mt-5 border-top border-secondary">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <div class="footer-logo mb-3">
            <i class="bi bi-lightning-charge-fill me-2"></i>
            <span class="brand-text">V-STRIDE</span>
          </div>

          <p class="text-secondary pe-lg-5 lh-lg mb-4">
            Đồng hành cùng bạn trên mọi cung đường. Chúng tôi mang đến những dòng Sneaker chính
            hãng, giúp bạn khẳng định phong cách riêng biệt và bứt phá giới hạn.
          </p>

          <div class="d-flex gap-3 mt-4">
            <a href="#" class="social-circle"><i class="bi bi-facebook"></i></a>
            <a href="#" class="social-circle"><i class="bi bi-instagram"></i></a>
            <a href="#" class="social-circle"><i class="bi bi-tiktok"></i></a>
            <a href="#" class="social-circle"><i class="bi bi-youtube"></i></a>
          </div>
        </div>

        <div class="col-lg-2 col-md-6">
          <h5 class="fw-bold mb-4 text-uppercase small text-warning tracking-wider">Khám phá</h5>
          <ul class="list-unstyled d-flex flex-column gap-2">
            <li><a href="#" class="footer-link" @click.prevent="footerNavFilter('Nam')">Giày Nam</a></li>
            <li><a href="#" class="footer-link" @click.prevent="footerNavFilter('Nữ')">Giày Nữ</a></li>
            <li>
              <a href="#" class="footer-link text-danger fw-bold" @click.prevent="footerNavFilter('sale')">
                🔥 Săn Sale
              </a>
            </li>
            <li><a href="#" class="footer-link">Bộ sưu tập mới</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6">
          <h5 class="fw-bold mb-4 text-uppercase small text-warning tracking-wider">Hỗ trợ</h5>
          <ul class="list-unstyled d-flex flex-column gap-2">
            <li><a href="#" class="footer-link">Hướng dẫn chọn size</a></li>
            <li><a href="#" class="footer-link">Chính sách đổi trả</a></li>
            <li><a href="#" class="footer-link">Thanh toán & Giao hàng</a></li>
            <li><router-link to="/orders" class="footer-link">Đơn hàng của tôi</router-link></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6">
          <h5 class="fw-bold mb-4 text-uppercase small text-warning tracking-wider">Liên hệ</h5>
          <div class="text-secondary small d-flex flex-column gap-3">
            <div class="d-flex align-items-start gap-2">
              <i class="bi bi-geo-alt-fill text-warning"></i>
              <span>123 Đường Sneaker, Quận 1, TP. HCM</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-telephone-fill text-warning"></i>
              <span>1900 6789 (8:00 - 22:00)</span>
            </div>
          </div>

          <div class="input-group mt-4 shadow-sm border border-secondary rounded-2 overflow-hidden">
            <input
              type="email"
              class="form-control bg-transparent text-white border-0 small shadow-none"
              placeholder="Nhận tin ưu đãi..."
            />
            <button class="btn btn-warning fw-bold px-3 border-0" type="button">GỬI</button>
          </div>
        </div>
      </div>

      <hr class="border-secondary mt-5 mb-4 opacity-10" />

      <div class="row align-items-center">
        <div class="col-md-6 text-center text-md-start">
          <p class="text-secondary mb-0 small">
            &copy; 2026 <strong class="text-white">V-STRIDE</strong>. All rights reserved.
          </p>
        </div>
        <div class="col-md-6 text-center text-md-end mt-3 mt-md-0 d-flex justify-content-center justify-content-md-end align-items-center gap-4">
          <img src="https://img.icons8.com/color/96/paypal.png" alt="Paypal" height="30" class="payment-icon" />
          <img src="https://img.icons8.com/color/96/mastercard.png" alt="Mastercard" height="30" class="payment-icon" />
          <img src="https://img.icons8.com/color/96/visa.png" alt="Visa" height="30" class="payment-icon" />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const footerNavFilter = (type) => {
  const query = type === 'sale' ? { filter: 'sale' } : { category: type }
  if (route.path === '/') {
    router.push({ query })
    window.dispatchEvent(new CustomEvent('scroll-to-products'))
  } else {
    router.push({ path: '/', query })
  }
}
</script>

<style scoped>
/* --- HIỆU ỨNG LOGO ĐỒNG BỘ --- */
.footer-logo i,
.footer-logo .brand-text {
  background: linear-gradient(to right, #fff 20%, #ffc107 40%, #ffc107 60%, #fff 80%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 4s linear infinite;
  display: inline-block;
}

.footer-logo .brand-text {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: -1px;
  text-transform: uppercase;
}

.footer-logo i {
  font-size: 2rem;
}

@keyframes shine {
  to { background-position: 200% center; }
}

/* --- CÁC HIỆU ỨNG KHÁC --- */
.social-circle {
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-circle:hover {
  background: #ffc107;
  color: #000;
  transform: translateY(-5px);
}

.footer-link {
  color: #adb5bd;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: inline-block;
}

.footer-link:hover {
  color: #ffc107 !important;
  transform: translateX(5px);
}

.payment-icon {
  filter: grayscale(1) opacity(0.5);
  transition: all 0.3s ease;
}

.payment-icon:hover {
  filter: grayscale(0) opacity(1);
  transform: scale(1.1);
}

.tracking-wider { letter-spacing: 1.5px; }
</style>
