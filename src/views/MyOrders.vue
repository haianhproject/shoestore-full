<template>
  <div class="container py-5 mt-3 min-vh-100">
    <div class="d-flex justify-content-between align-items-end mb-5">
      <div>
        <h2 class="fw-bolder display-5 text-uppercase mb-1">Lịch sử đơn hàng</h2>
        <p class="text-muted mb-0">Quản lý và theo dõi trạng thái các đơn hàng đã đặt</p>
      </div>
      <router-link to="/" class="btn btn-dark rounded-pill px-4 fw-bold shadow-sm">
        Tiếp tục mua sắm
      </router-link>
    </div>

    <div v-if="orders.length > 0">
      <div
        class="card border-0 shadow-lg rounded-4 mb-5 overflow-hidden order-card border"
        v-for="order in orders"
        :key="order.orderId"
      >
        <div class="card-header bg-white p-4 border-bottom">
          <div class="row align-items-center">
            <div class="col-md-7">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-dark text-white rounded-3 px-3 py-2 fw-bold">
                  #{{ order.orderId }}
                </div>
                <div>
                  <div class="text-muted small text-uppercase fw-bold">Ngày đặt hàng</div>
                  <div class="fw-bold">{{ order.date }}</div>
                </div>
              </div>
            </div>
            <div class="col-md-5 text-md-end mt-3 mt-md-0">
              <span :class="statusBadge(order.status)" class="badge rounded-pill px-4 py-2 fs-6 shadow-sm">
                {{ order.status || 'Chờ xác nhận' }}
              </span>
            </div>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="row g-0">
            <div class="col-lg-8 p-4">
              <h6 class="fw-bold text-uppercase mb-4 text-muted small">Chi tiết sản phẩm</h6>
              <div class="product-item d-flex align-items-center mb-4 pb-4 border-bottom" v-for="(item, idx) in order.items" :key="idx">
                <div class="flex-shrink-0 me-3">
                  <img :src="item.image || item.img" class="rounded-3 border bg-light p-1" width="80" height="80" style="object-fit: contain">
                </div>
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-1">{{ item.name }}</h6>
                  <div class="d-flex gap-3 text-muted small">
                    <span>Size: <strong class="text-dark">{{ item.size }}</strong></span>
                    <span>Số lượng: <strong class="text-dark">x{{ item.quantity }}</strong></span>
                  </div>
                </div>
                <div class="text-end fw-bold fs-5 text-dark">
                  ${{ (item.price * item.quantity) }}
                </div>
              </div>
            </div>

            <div class="col-lg-4 bg-light p-4 border-start">
              <div class="mb-4">
                <h6 class="fw-bold text-uppercase mb-3 text-muted small">📍 Thông tin nhận hàng</h6>
                <div class="p-3 bg-white rounded-3 border shadow-sm">
                  <p class="mb-1 fw-bold">{{ order.delivery?.name || 'N/A' }}</p>
                  <p class="mb-1 text-muted small"><i class="bi bi-telephone"></i> {{ order.delivery?.phone || 'N/A' }}</p>
                  <p class="mb-0 text-muted small"><i class="bi bi-geo-alt"></i> {{ order.delivery?.address || 'N/A' }}</p>
                </div>
              </div>

              <div class="mb-2">
                <h6 class="fw-bold text-uppercase mb-3 text-muted small">💳 Chi tiết thanh toán</h6>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Phương thức:</span>
                  <span class="fw-bold text-dark small text-end">{{ order.paymentMethod || 'Tiền mặt (COD)' }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2" v-if="order.discount > 0">
                  <span class="text-muted">Giảm giá:</span>
                  <span class="text-danger fw-bold">-${{ order.discount }}</span>
                </div>
                <hr class="my-3">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold text-uppercase">Tổng tiền:</span>
                  <span class="display-6 fw-bold text-danger">${{ order.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5 shadow-sm rounded-5 bg-white border-2 border-dashed">
      <div class="display-1 mb-3">📦</div>
      <h3 class="fw-bold">Bạn chưa có đơn hàng nào</h3>
      <p class="text-muted mb-4">Có vẻ như bạn chưa thực hiện giao dịch nào. Hãy khám phá các mẫu giày mới nhất nhé!</p>
      <router-link to="/" class="btn btn-warning btn-lg rounded-pill px-5 fw-bold shadow">
        Mua sắm ngay bây giờ
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);

onMounted(() => {
  try {
    const data = localStorage.getItem('orders');
    if (data) {
      const parsedData = JSON.parse(data);
      // Đảm bảo dữ liệu là mảng
      orders.value = Array.isArray(parsedData) ? parsedData : [];
      console.log("Đã tải đơn hàng:", orders.value);
    }
  } catch (err) {
    console.error("Lỗi đọc Storage:", err);
  }
});

// Hàm màu sắc trạng thái
const statusBadge = (status) => {
  switch (status) {
    case 'Chờ xác nhận': return 'bg-warning text-dark';
    case 'Đang giao hàng': return 'bg-primary text-white';
    case 'Đã hoàn thành': return 'bg-success text-white';
    default: return 'bg-secondary text-white';
  }
};
</script>

<style scoped>
.order-card {
  transition: transform 0.3s ease;
}
.order-card:hover {
  transform: translateY(-5px);
}
.product-item:last-child {
  border-bottom: none !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
.border-dashed {
  border-style: dashed !important;
}
</style>
