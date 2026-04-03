<template>
  <div class="admin-fullscreen-wrapper">

    <aside class="sidebar bg-black text-white d-flex flex-column shadow-lg">
      <div class="sidebar-brand d-flex align-items-center justify-content-center py-4 border-bottom border-secondary border-opacity-25">
        <h3 class="fw-black mb-0 text-white tracking-widest cursor-pointer" @click="currentTab = 'dashboard'">
          <i class="bi bi-lightning-charge-fill text-warning me-1"></i>V-STRIDE<span class="text-warning">.</span>
        </h3>
      </div>

      <div class="sidebar-menu flex-grow-1 py-4 px-3 overflow-auto hide-scrollbar">
        <p class="text-uppercase text-muted small fw-bold mb-2 px-3 tracking-wider">Kinh doanh</p>
        <a href="#" class="menu-item" :class="{ 'active': currentTab === 'dashboard' }" @click.prevent="currentTab = 'dashboard'">
          <i class="bi bi-grid-1x2-fill me-3"></i>Tổng quan
        </a>
        <a href="#" class="menu-item" :class="{ 'active': currentTab === 'orders' }" @click.prevent="currentTab = 'orders'">
          <i class="bi bi-receipt-cutoff me-3"></i>Đơn hàng
          <span class="badge bg-warning text-dark ms-auto rounded-pill fw-bold">{{ orders.length }}</span>
        </a>

        <p class="text-uppercase text-muted small fw-bold mt-4 mb-2 px-3 tracking-wider">Cửa hàng</p>
        <a href="#" class="menu-item" :class="{ 'active': currentTab === 'products' }" @click.prevent="currentTab = 'products'">
          <i class="bi bi-box-seam-fill me-3"></i>Sản phẩm
        </a>
        <a href="#" class="menu-item" :class="{ 'active': currentTab === 'customers' }" @click.prevent="currentTab = 'customers'">
          <i class="bi bi-people-fill me-3"></i>Khách hàng
        </a>
        <a href="#" class="menu-item" :class="{ 'active': currentTab === 'settings' }" @click.prevent="currentTab = 'settings'">
          <i class="bi bi-gear-fill me-3"></i>Cài đặt
        </a>
      </div>

      <div class="sidebar-footer p-4 border-top border-secondary border-opacity-25">
        <div class="d-flex align-items-center gap-3 mb-3 px-2">
          <div class="avatar bg-warning text-black rounded-circle fw-bold d-flex align-items-center justify-content-center fs-5 shadow-sm" style="width: 40px; height: 40px;">A</div>
          <div>
            <h6 class="mb-0 fw-bold text-white">Admin Sếp</h6>
            <small class="text-success"><i class="bi bi-circle-fill" style="font-size: 8px;"></i> Đang hoạt động</small>
          </div>
        </div>
        <button @click="handleLogout" class="btn btn-outline-warning w-100 fw-bold border-2 rounded-pill hover-lift">
          <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
        </button>
      </div>
    </aside>

    <main class="main-content bg-light">

      <header class="topbar bg-white px-4 px-md-5 py-3 d-flex justify-content-between align-items-center shadow-sm sticky-top">
        <div>
          <h4 class="fw-bold text-dark mb-0 text-uppercase">{{ tabTitle }}</h4>
          <p class="text-muted small mb-0">Hôm nay: {{ currentDate }}</p>
        </div>
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-light rounded-circle position-relative p-2" @click="fetchAllData">
            <i class="bi bi-arrow-clockwise fs-5 text-dark" :class="{'spin-anim': loading}"></i>
          </button>
        </div>
      </header>

      <div class="p-4 p-md-5 content-scroll">

        <div v-if="loading" class="text-center py-5 mt-5">
          <div class="spinner-border text-warning" style="width: 4rem; height: 4rem;" role="status"></div>
          <h5 class="mt-4 text-dark fw-bold">Đang tải dữ liệu từ máy chủ...</h5>
        </div>

        <div v-else>

          <div v-if="currentTab === 'dashboard'">
            <div class="row g-4 mb-5">
              <div class="col-xl-3 col-md-6">
                <div class="stat-card bg-warning text-dark rounded-4 p-4 h-100 shadow position-relative overflow-hidden">
                  <div class="position-relative z-1">
                    <h6 class="fw-bold text-uppercase tracking-wider mb-2 opacity-75">Doanh Thu</h6>
                    <h2 class="display-6 fw-black mb-0">${{ totalRevenue.toLocaleString('vi-VN') }}</h2>
                  </div>
                  <i class="bi bi-wallet2 position-absolute text-dark opacity-10" style="font-size: 6rem; right: -10px; bottom: -20px;"></i>
                </div>
              </div>
              <div class="col-xl-3 col-md-6">
                <div class="stat-card bg-black text-white rounded-4 p-4 h-100 shadow position-relative overflow-hidden">
                  <div class="position-relative z-1">
                    <h6 class="fw-bold text-uppercase tracking-wider mb-2 text-warning">Đơn Hàng</h6>
                    <h2 class="display-6 fw-black mb-0">{{ orders.length }}</h2>
                  </div>
                  <i class="bi bi-box-seam position-absolute text-white opacity-10" style="font-size: 6rem; right: -10px; bottom: -20px;"></i>
                </div>
              </div>
              <div class="col-xl-3 col-md-6">
                <div class="stat-card bg-white text-dark rounded-4 p-4 h-100 shadow-sm border position-relative overflow-hidden">
                  <div class="position-relative z-1">
                    <h6 class="fw-bold text-uppercase tracking-wider mb-2 text-muted">Khách Hàng</h6>
                    <h2 class="display-6 fw-black mb-0">{{ customers.length }}</h2>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-md-6">
                <div class="stat-card bg-white text-dark rounded-4 p-4 h-100 shadow-sm border position-relative overflow-hidden">
                  <div class="position-relative z-1">
                    <h6 class="fw-bold text-uppercase tracking-wider mb-2 text-muted">Sản Phẩm</h6>
                    <h2 class="display-6 fw-black mb-0">{{ products.length }}</h2>
                  </div>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center rounded-top-4">
                <h5 class="fw-bold mb-0 text-dark">Đơn Hàng Gần Đây</h5>
                <button class="btn btn-sm btn-dark rounded-pill fw-bold px-3" @click="currentTab = 'orders'">Xem tất cả</button>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0 custom-table">
                    <thead class="bg-light text-muted small text-uppercase">
                      <tr>
                        <th class="ps-4 py-3">Mã Đơn</th>
                        <th class="py-3">Khách Hàng</th>
                        <th class="py-3">Ngày Đặt</th>
                        <th class="py-3">Tổng Tiền</th>
                        <th class="pe-4 py-3">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in orders.slice(0, 5)" :key="order.id">
                        <td class="ps-4 fw-bold text-dark">#{{ order.orderId ? order.orderId.substring(order.orderId.length - 6) : 'N/A' }}</td>
                        <td class="fw-bold">{{ order.delivery?.name || 'Khách Vãng Lai' }}</td>
                        <td class="text-muted small">{{ order.date }}</td>
                        <td class="fw-bold text-danger">${{ order.total }}</td>
                        <td class="pe-4"><span class="badge rounded-pill px-3 py-2 fw-bold" :class="getStatusClass(order.status)">{{ order.status }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentTab === 'products'">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <input type="text" class="form-control rounded-pill w-25 shadow-sm" placeholder="🔍 Tìm kiếm sản phẩm...">
              <button class="btn btn-warning rounded-pill fw-bold shadow-sm px-4" @click="openProductModal()">
                <i class="bi bi-plus-lg me-1"></i> THÊM SẢN PHẨM MỚI
              </button>
            </div>

            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0 custom-table">
                    <thead class="bg-dark text-white small text-uppercase">
                      <tr>
                        <th class="ps-4 py-3">Sản phẩm</th>
                        <th class="py-3">Danh mục</th>
                        <th class="py-3">Giá bán</th>
                        <th class="py-3">Giá gốc</th>
                        <th class="pe-4 py-3 text-end">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="products.length === 0">
                        <td colspan="5" class="text-center py-5 text-muted fw-bold">Chưa có sản phẩm nào. Hãy thêm mới!</td>
                      </tr>
                      <tr v-for="item in products" :key="item.id">
                        <td class="ps-4">
                          <div class="d-flex align-items-center gap-3">
                            <img :src="item.image" class="rounded-3 border bg-light object-fit-contain p-1" width="50" height="50">
                            <span class="fw-bold text-dark">{{ item.name }}</span>
                          </div>
                        </td>
                        <td><span class="badge bg-secondary rounded-pill px-3">{{ item.category }}</span></td>
                        <td class="fw-bold text-danger">${{ item.price }}</td>
                        <td class="text-muted text-decoration-line-through">${{ item.oldPrice || 0 }}</td>
                        <td class="pe-4 text-end">
                          <button class="btn btn-sm btn-light rounded-circle me-2 shadow-sm" @click="openProductModal(item)"><i class="bi bi-pencil-fill text-primary"></i></button>
                          <button class="btn btn-sm btn-light rounded-circle shadow-sm" @click="deleteProduct(item.id)"><i class="bi bi-trash-fill text-danger"></i></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentTab === 'orders'">
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0 custom-table">
                    <thead class="bg-dark text-white small text-uppercase">
                      <tr>
                        <th class="ps-4 py-3">Mã Đơn</th>
                        <th class="py-3">Khách Hàng</th>
                        <th class="py-3">Tổng Tiền</th>
                        <th class="py-3">Trạng Thái</th>
                        <th class="pe-4 py-3 text-end">Cập Nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in orders" :key="order.id">
                        <td class="ps-4 fw-bold">#{{ order.orderId ? order.orderId.substring(order.orderId.length - 6) : 'N/A' }}</td>
                        <td>
                          <div class="fw-bold">{{ order.delivery?.name }}</div>
                          <div class="small text-muted">{{ order.delivery?.phone }}</div>
                        </td>
                        <td class="fw-bold text-danger">${{ order.total }}</td>
                        <td><span class="badge rounded-pill px-3 py-2 fw-bold" :class="getStatusClass(order.status)">{{ order.status }}</span></td>
                        <td class="pe-4 text-end">
                          <select class="form-select form-select-sm d-inline-block w-auto rounded-pill fw-bold border-dark shadow-sm" :value="order.status" @change="updateOrderStatus(order.id, $event.target.value)">
                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                            <option value="Đã xác nhận">Đã xác nhận</option>
                            <option value="Đang vận chuyển">Đang vận chuyển</option>
                            <option value="Đã giao">Đã giao</option>
                            <option value="Đã hủy">Hủy đơn</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentTab === 'customers'">
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0 custom-table">
                    <thead class="bg-dark text-white small text-uppercase">
                      <tr>
                        <th class="ps-4 py-3">Tài Khoản</th>
                        <th class="py-3">Email</th>
                        <th class="py-3">Quyền hạn</th>
                        <th class="pe-4 py-3 text-end">UID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in customers" :key="user.uid">
                        <td class="ps-4 fw-bold text-dark"><i class="bi bi-person-circle fs-4 text-warning me-2 align-middle"></i>{{ user.username }}</td>
                        <td class="text-muted">{{ user.email }}</td>
                        <td><span class="badge rounded-pill px-3" :class="user.role === 'admin' ? 'bg-danger' : 'bg-success'">{{ user.role || 'Khách hàng' }}</span></td>
                        <td class="pe-4 text-end small text-muted font-monospace">{{ user.uid.substring(0,8) }}...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentTab === 'settings'" class="text-center py-5">
            <i class="bi bi-tools display-1 text-muted opacity-50 mb-3"></i>
            <h4 class="fw-bold">Đang phát triển</h4>
            <p class="text-muted">Khu vực cấu hình hệ thống sẽ sớm ra mắt.</p>
          </div>

        </div>
      </div>
    </main>

    <Teleport to="body">
      <div v-if="showProductModal" class="modal-overlay d-flex align-items-center justify-content-center">
        <div class="modal-content-custom bg-white p-0 rounded-4 shadow-lg animate-zoom overflow-hidden" style="max-width: 500px; width: 95%;">
          <div class="bg-dark text-white p-4 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0 text-warning">{{ isEditing ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới' }}</h5>
            <button class="btn-close btn-close-white" @click="showProductModal = false"></button>
          </div>
          <div class="p-4">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label class="form-label small fw-bold">Tên giày</label>
                <input type="text" class="form-control shadow-none" v-model="productForm.name" required>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label small fw-bold">Giá bán ($)</label>
                  <input type="number" class="form-control shadow-none" v-model="productForm.price" required>
                </div>
                <div class="col-6">
                  <label class="form-label small fw-bold">Giá gốc ($)</label>
                  <input type="number" class="form-control shadow-none" v-model="productForm.oldPrice">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Danh mục</label>
                <select class="form-select shadow-none" v-model="productForm.category">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  
                </select>
              </div>
              <div class="mb-4">
                <label class="form-label small fw-bold">Link Ảnh (URL)</label>
                <input type="text" class="form-control shadow-none" v-model="productForm.image" placeholder="https://..." required>
                <div class="mt-2 text-center" v-if="productForm.image">
                  <img :src="productForm.image" height="80" class="rounded border object-fit-contain p-1">
                </div>
              </div>
              <button type="submit" class="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm hover-lift" :disabled="isSaving">
                {{ isSaving ? 'ĐANG LƯU...' : 'LƯU SẢN PHẨM' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <transition name="toast-slide">
        <div v-if="toast.show" class="custom-toast shadow-lg" :class="toast.type">
          <i :class="toast.icon" class="fs-4 me-2"></i>
          <span class="fw-bold">{{ toast.message }}</span>
        </div>
      </transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const router = useRouter();
const loading = ref(true);
const currentTab = ref('dashboard');

// Dữ liệu
const orders = ref([]);
const products = ref([]);
const customers = ref([]);

const totalRevenue = computed(() => orders.value.reduce((sum, order) => sum + Number(order.total || 0), 0));
const tabTitle = computed(() => {
  const titles = { dashboard: 'Tổng Quan', products: 'Quản Lý Sản Phẩm', orders: 'Quản Lý Đơn Hàng', customers: 'Danh Sách Khách Hàng', settings: 'Cài Đặt Hệ Thống' };
  return titles[currentTab.value];
});

const currentDate = computed(() => new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

// Biến cho Product Modal
const showProductModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const productForm = ref({ id: null, name: '', price: 0, oldPrice: 0, category: 'Nam', image: '' });

// Toast
const toast = ref({ show: false, message: '', type: 'success', icon: 'bi-check-circle-fill' });
let toastTimer = null;
const showNotification = (msg, type = 'success') => {
  toast.value = { message: msg, type, icon: type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill', show: true };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.value.show = false, 3000);
};

// 1. KIỂM TRA QUYỀN VÀ TẢI DỮ LIỆU
onMounted(async () => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return router.push('/login');
  const user = JSON.parse(userStr);
  if (user.role !== 'admin') {
    alert("Khu vực này chỉ dành cho Ban Quản Trị!");
    return router.push('/');
  }
  await fetchAllData();
});

const fetchAllData = async () => {
  loading.value = true;
  try {
    // Tải Đơn Hàng
    const ordersSnap = await getDocs(collection(db, 'orders'));
    orders.value = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => Number(b.orderId) - Number(a.orderId));

    // Tải Sản Phẩm (Lấy từ Firebase collection 'products')
    const productsSnap = await getDocs(collection(db, 'products'));
    products.value = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Tải Khách Hàng
    const usersSnap = await getDocs(collection(db, 'users'));
    customers.value = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch  {
    showNotification('Lỗi tải dữ liệu!', 'error');
  } finally {
    loading.value = false;
  }
};

// 2. CHỨC NĂNG SẢN PHẨM (CRUD)
const openProductModal = (item = null) => {
  if (item) {
    isEditing.value = true;
    productForm.value = { ...item };
  } else {
    isEditing.value = false;
    productForm.value = { id: null, name: '', price: 0, oldPrice: 0, category: 'Nam', image: '' };
  }
  showProductModal.value = true;
};

const saveProduct = async () => {
  isSaving.value = true;
  try {
    const dataToSave = {
      name: productForm.value.name,
      price: Number(productForm.value.price),
      oldPrice: Number(productForm.value.oldPrice),
      category: productForm.value.category,
      image: productForm.value.image
    };

    if (isEditing.value) {
      await updateDoc(doc(db, 'products', productForm.value.id), dataToSave);
      showNotification('Đã cập nhật sản phẩm', 'success');
    } else {
      await addDoc(collection(db, 'products'), dataToSave);
      showNotification('Đã thêm sản phẩm mới', 'success');
    }
    showProductModal.value = false;
    await fetchAllData(); // Refresh list
  } catch  {
    showNotification('Lỗi khi lưu sản phẩm', 'error');
  } finally {
    isSaving.value = false;
  }
};

const deleteProduct = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
  try {
    await deleteDoc(doc(db, 'products', id));
    showNotification('Đã xóa sản phẩm', 'success');
    await fetchAllData();
  } catch  {
    showNotification('Lỗi xóa sản phẩm', 'error');
  }
};

// 3. CHỨC NĂNG ĐƠN HÀNG
const updateOrderStatus = async (id, newStatus) => {
  try {
    await updateDoc(doc(db, 'orders', id), { status: newStatus });
    showNotification('Đã cập nhật trạng thái đơn', 'success');
    const orderIndex = orders.value.findIndex(o => o.id === id);
    if(orderIndex !== -1) orders.value[orderIndex].status = newStatus;
  } catch  {
    showNotification('Lỗi cập nhật trạng thái', 'error');
  }
};

const getStatusClass = (status) => {
  if (status === 'Đã giao') return 'bg-success text-white';
  if (status === 'Đang vận chuyển') return 'bg-primary text-white';
  if (status === 'Đã xác nhận') return 'bg-info text-dark';
  if (status === 'Đã hủy') return 'bg-danger text-white';
  return 'bg-warning text-dark'; // Chờ xác nhận
};

// 4. CHỨC NĂNG HỆ THỐNG
const handleLogout = async () => {
  await signOut(auth);
  localStorage.removeItem('currentUser');
  window.dispatchEvent(new Event('auth-updated'));
  router.push('/login');
};
</script>

<style scoped>
.admin-fullscreen-wrapper { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999999; display: flex; background-color: #f8f9fa; overflow: hidden; }

/* SIDEBAR */
.sidebar { width: 260px; height: 100vh; flex-shrink: 0; }
.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.fw-black { font-weight: 900; }
.menu-item { display: flex; align-items: center; padding: 14px 20px; color: #a1a1aa; text-decoration: none; font-weight: 600; border-radius: 12px; margin-bottom: 5px; transition: all 0.2s ease; }
.menu-item i { font-size: 1.2rem; }
.menu-item:hover { background-color: rgba(255, 255, 255, 0.05); color: #fff; }
.menu-item.active { background-color: #ffc107; color: #000; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3); }
.menu-item.active i { color: #000 !important; }

/* MAIN CONTENT */
.main-content { flex-grow: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.content-scroll { flex-grow: 1; overflow-y: auto; }

/* CARDS & TABLES */
.stat-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.stat-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
.custom-table th { border-bottom: 2px solid #e9ecef; font-weight: 700; }
.custom-table td { border-bottom: 1px solid #f1f3f5; padding-top: 1rem; padding-bottom: 1rem; }
.custom-table tbody tr:hover { background-color: #f8f9fa; }

/* MODAL & TOAST */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); z-index: 1050000; }
.animate-zoom { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
.custom-toast { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 12px; color: white; z-index: 1100000; display: flex; align-items: center; min-width: 250px; }
.custom-toast.error { background-color: #dc3545; border-left: 5px solid #842029; }
.custom-toast.success { background-color: #198754; border-left: 5px solid #0f5132; }

/* TIỆN ÍCH */
.cursor-pointer { cursor: pointer; }
.hover-lift { transition: all 0.2s; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.spin-anim { animation: spin 0.5s linear; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* RESPONSIVE ĐIỆN THOẠI */
@media (max-width: 992px) {
  .sidebar { width: 80px; }
  .sidebar-brand h3 span, .sidebar-brand h3 i { display: none; }
  .sidebar-brand h3 { font-size: 1.5rem; text-align: center; }
  .sidebar-brand h3::before { content: "V."; color: #ffc107; }
  .sidebar-menu p { display: none; }
  .menu-item { justify-content: center; padding: 15px 0; }
  .menu-item i { margin: 0 !important; font-size: 1.5rem; }
  .menu-item span { display: none; }
  .sidebar-footer h6, .sidebar-footer small, .sidebar-footer button text, .sidebar-footer button i { display: none; }
  .sidebar-footer .avatar { margin: 0 auto; }
}
</style>
