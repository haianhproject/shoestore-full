<template>
  <div class="container py-5 mt-3 min-vh-100">
    <div class="d-flex justify-content-between align-items-end mb-4">
      <div>
        <h2 class="fw-bolder display-5 text-uppercase mb-1">Lịch sử đơn hàng</h2>
        <p class="text-muted mb-0">Quản lý và theo dõi trạng thái các đơn hàng đã đặt</p>
      </div>
      <router-link to="/" class="btn btn-dark rounded-pill px-4 fw-bold shadow-sm">
        Tiếp tục mua sắm
      </router-link>
    </div>

    <ul class="nav nav-pills mb-4 gap-2 flex-nowrap overflow-auto hide-scrollbar pb-2">
      <li class="nav-item" v-for="tab in tabs" :key="tab">
        <a
          class="nav-link cursor-pointer rounded-pill px-4 fw-bold transition-all"
          :class="activeTab === tab ? 'bg-dark text-white shadow' : 'bg-light text-dark hover-gray'"
          @click="activeTab = tab"
        >
          {{ tab }}
          <span v-if="tab === 'Tất cả'" class="badge bg-warning text-dark ms-1 rounded-pill">{{ orders.length }}</span>
        </a>
      </li>
    </ul>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted fw-bold">Đang tải dữ liệu đơn hàng...</p>
    </div>

    <div v-else-if="filteredOrders.length > 0">
      <div
        class="card border-0 shadow-lg rounded-4 mb-5 overflow-hidden order-card border"
        v-for="order in filteredOrders"
        :key="order.orderId"
      >
        <div class="card-header bg-white p-4 border-bottom">
          <div class="row align-items-center">
            <div class="col-md-7">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-dark text-white rounded-3 px-3 py-2 fw-bold shadow-sm">
                  #{{ order.orderId }}
                </div>
                <div>
                  <div class="text-muted small text-uppercase fw-bold">Thời gian đặt hàng</div>
                  <div class="fw-bold text-dark">{{ formatDateTime(order) }}</div>
                </div>
              </div>
            </div>
            <div class="col-md-5 text-md-end mt-3 mt-md-0">
              <span :class="statusBadge(order.status)" class="badge rounded-pill px-4 py-2 fs-6 shadow-sm">
                <i :class="statusIcon(order.status)" class="me-1"></i>
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
                  <img :src="item.image || item.img" class="rounded-3 border bg-light p-1 shadow-sm" width="80" height="80" style="object-fit: contain">
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
                <hr class="my-3 border-secondary border-opacity-25">
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
      <div class="display-1 mb-3 text-muted">📭</div>
      <h3 class="fw-bold">Không có đơn hàng nào</h3>
      <p class="text-muted mb-4">Không tìm thấy đơn hàng nào trong trạng thái "<span class="text-dark fw-bold">{{ activeTab }}</span>".</p>
      <button v-if="activeTab !== 'Tất cả'" @click="activeTab = 'Tất cả'" class="btn btn-outline-dark rounded-pill px-4 fw-bold">
        Xem tất cả đơn hàng
      </button>
      <router-link v-else to="/" class="btn btn-warning btn-lg rounded-pill px-5 fw-bold shadow">
        Mua sắm ngay bây giờ
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const router = useRouter();
const orders = ref([]);
const loading = ref(true);

const tabs = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang vận chuyển', 'Đã giao'];
const activeTab = ref('Tất cả');

const filteredOrders = computed(() => {
  if (activeTab.value === 'Tất cả') return orders.value;
  return orders.value.filter(order => (order.status || 'Chờ xác nhận') === activeTab.value);
});

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await fetchOrdersFromFirebase(user.uid);
    } else {
      loading.value = false;
      router.push('/login');
    }
  });
});

const fetchOrdersFromFirebase = async (userId) => {
  try {
    loading.value = true;
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const fetchedOrders = [];
    querySnapshot.forEach((doc) => {
      fetchedOrders.push({ id: doc.id, ...doc.data() });
    });

    // Thuật toán sắp xếp an toàn, đẩy đơn mới lên đầu
    fetchedOrders.sort((a, b) => {
      const numA = Number(a.orderId);
      const numB = Number(b.orderId);
      if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0;
    });

    if (fetchedOrders.length > 0 && isNaN(Number(fetchedOrders[0].orderId))) {
      fetchedOrders.reverse();
    }

    orders.value = fetchedOrders;
  } catch (err) {
    console.error("Lỗi khi tải đơn hàng:", err);
  } finally {
    loading.value = false;
  }
};

const formatDateTime = (order) => {
  if (order.date) return order.date;
  const timestamp = Number(order.orderId);
  if (!isNaN(timestamp) && timestamp > 1000000000000) {
    return new Date(timestamp).toLocaleString('vi-VN');
  }
  return 'Thời gian không xác định';
};

const statusBadge = (status) => {
  switch (status) {
    case 'Chờ xác nhận': return 'bg-warning text-dark';
    case 'Đã xác nhận': return 'bg-info text-dark';
    case 'Đang vận chuyển': return 'bg-primary text-white';
    case 'Đã giao': return 'bg-success text-white';
    default: return 'bg-warning text-dark';
  }
};

const statusIcon = (status) => {
  switch (status) {
    case 'Chờ xác nhận': return 'bi bi-hourglass-split';
    case 'Đã xác nhận': return 'bi bi-check-circle';
    case 'Đang vận chuyển': return 'bi bi-truck';
    case 'Đã giao': return 'bi bi-box-seam';
    default: return 'bi bi-hourglass-split';
  }
};
</script>

<style scoped>
.order-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.order-card:hover { transform: translateY(-3px); box-shadow: 0 1rem 3rem rgba(0,0,0,.15)!important; }
.product-item:last-child { border-bottom: none !important; margin-bottom: 0 !important; padding-bottom: 0 !important; }
.border-dashed { border-style: dashed !important; }
.cursor-pointer { cursor: pointer; }
.transition-all { transition: all 0.2s ease-in-out; }
.hover-gray:hover { background-color: #e9ecef !important; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
