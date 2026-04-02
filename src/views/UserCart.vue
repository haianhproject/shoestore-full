<template>
  <div class="cart-wrapper position-relative">
    <div class="container py-5 cart-page">
      <h2 class="fw-bolder display-6 mb-4 text-uppercase">Thanh Toán Đơn Hàng</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-2 text-muted">Đang tải giỏ hàng từ Cloud...</p>
      </div>

      <div class="row g-4" v-else-if="cart.length > 0">
        <div class="col-lg-7 col-xl-8">
          <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4 border-bottom pb-2">📍 Địa chỉ nhận hàng</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Họ và tên</label>
                  <input
                    type="text"
                    class="form-control shadow-none"
                    placeholder="VD: Nguyễn Văn A"
                    v-model="delivery.name"
                  />
                  <small class="text-muted">Nhập đầy đủ họ và tên</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Số điện thoại</label>
                  <input
                    type="text"
                    class="form-control shadow-none"
                    placeholder="VD: 0987654321"
                    v-model="delivery.phone"
                  />
                  <small class="text-muted">Gồm 10 chữ số</small>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    class="form-control shadow-none"
                    placeholder="Số nhà, tên đường, phường/xã..."
                    v-model="delivery.address"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4 border-bottom pb-2">📦 Sản phẩm của bạn</h5>
              <div
                class="row align-items-center mb-3 pb-3 border-bottom"
                v-for="item in cart"
                :key="item.id"
              >
                <div class="col-3 col-md-2">
                  <img
                    :src="item.image"
                    class="img-fluid rounded-3 bg-light p-2 object-fit-contain"
                    :alt="item.name"
                  />
                </div>
                <div class="col-9 col-md-5">
                  <h6 class="fw-bold mb-1">{{ item.name }}</h6>
                  <div class="d-flex align-items-center gap-2 mt-2">
                    <span class="text-muted small">Size:</span>
                    <select
                      class="form-select form-select-sm w-auto shadow-sm fw-bold border-warning"
                      v-model="item.size"
                      @change="updateCartItem(item)"
                    >
                      <option v-for="s in allSizes" :key="s" :value="s">Size {{ s }}</option>
                    </select>
                  </div>
                  <p class="text-danger fw-bold mb-0 mt-2">${{ item.price }}</p>
                </div>
                <div class="col-6 col-md-3 mt-3 mt-md-0 d-flex justify-content-md-center">
                  <div class="input-group input-group-sm w-75 shadow-sm">
                    <button class="btn btn-outline-dark" @click="changeQty(item, -1)">-</button>
                    <input
                      type="text"
                      class="form-control text-center fw-bold"
                      :value="item.quantity"
                      readonly
                    />
                    <button class="btn btn-outline-dark" @click="changeQty(item, 1)">+</button>
                  </div>
                </div>
                <div class="col-6 col-md-2 mt-3 mt-md-0 d-flex flex-column align-items-end">
                  <span class="fw-bold text-dark fs-5 mb-2">${{ item.price * item.quantity }}</span>
                  <button
                    class="btn btn-sm btn-danger rounded-pill px-3"
                    @click="askRemoveItem(item.id)"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5 col-xl-4">
          <div class="card border-0 shadow-lg rounded-4 bg-dark text-white sticky-summary">
            <div class="card-body p-4">
              <h4 class="fw-bold mb-4 text-warning border-bottom border-secondary pb-3">
                Tổng Đơn Hàng
              </h4>

              <div class="mb-4">
                <label class="form-label small text-uppercase text-muted fw-bold">Mã Voucher</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control shadow-none text-uppercase"
                    v-model="voucherCode"
                    placeholder="SALE50"
                  />
                  <button class="btn btn-light fw-bold" @click="applyVoucher">Áp dụng</button>
                </div>
                <small class="text-success mt-1 d-block" v-if="discountAmount > 0"
                  >✓ Đã áp dụng giảm ${{ discountAmount }}</small
                >
                <small class="text-danger mt-1 d-block" v-if="voucherError">{{
                  voucherError
                }}</small>
              </div>

              <div class="mb-4">
                <label class="form-label small text-uppercase text-muted fw-bold"
                  >Phương thức</label
                >
                <div class="form-check mb-2">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="cod"
                    v-model="paymentMethod"
                    id="cod"
                  />
                  <label class="form-check-label" for="cod">💵 Tiền mặt (COD)</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="card"
                    v-model="paymentMethod"
                    id="card"
                  />
                  <label class="form-check-label" for="card">💳 Thẻ tín dụng</label>
                </div>
              </div>

              <hr class="border-secondary mb-3" />
              <div class="d-flex justify-content-between mb-2">
                <span class="text-light">Tạm tính ({{ totalItems }} sp)</span>
                <span class="fw-bold">${{ subTotal }}</span>
              </div>
              <div class="d-flex justify-content-between mb-4 pt-3 border-top border-secondary">
                <span class="fs-5 fw-bold">Tổng thanh toán</span>
                <span class="display-6 fw-bold text-warning">${{ finalTotal }}</span>
              </div>

              <button
                class="btn btn-warning w-100 rounded-pill fw-bold py-3 text-uppercase fs-5"
                @click="placeOrder"
                :disabled="processing"
              >
                {{ processing ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <h1 class="display-1 text-muted mb-3">🛒</h1>
        <h4 class="fw-bold">Giỏ hàng của bạn đang trống</h4>
        <router-link to="/" class="btn btn-dark rounded-pill px-5 mt-3 fw-bold py-2"
          >MUA SẮM NGAY</router-link
        >
      </div>
    </div>

    <transition name="toast-slide">
      <div v-if="toast.show" class="custom-toast shadow-lg" :class="toast.type">
        <i :class="toast.icon" class="fs-4 me-2"></i>
        <span class="fw-bold">{{ toast.message }}</span>
      </div>
    </transition>

    <div
      v-if="showDeleteModal"
      class="modal-overlay d-flex align-items-center justify-content-center"
    >
      <div class="modal-content-custom p-4 text-center rounded-5 shadow-lg animate-zoom">
        <i class="bi bi-trash3 text-danger display-5 mb-3"></i>
        <h5 class="fw-bold">Xóa sản phẩm này?</h5>
        <div class="d-flex gap-2 mt-4">
          <button
            @click="showDeleteModal = false"
            class="btn btn-light rounded-pill flex-fill fw-bold"
          >
            HỦY
          </button>
          <button @click="confirmDelete" class="btn btn-danger rounded-pill flex-fill fw-bold">
            XÓA NGAY
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showOrderSuccess"
      class="modal-overlay d-flex align-items-center justify-content-center"
    >
      <div class="modal-content-custom p-5 text-center rounded-5 shadow-lg animate-zoom">
        <div class="celebration-icon mb-4">
          <i
            class="bi bi-check-all text-white bg-success rounded-circle display-1 px-3 py-1 shadow-lg"
          ></i>
        </div>
        <h2 class="fw-bold text-uppercase">Đặt hàng thành công!</h2>
        <p class="text-muted mb-4">Đơn hàng của bạn đang được chúng tôi xử lý.</p>
        <div class="d-grid gap-2">
          <button @click="goToOrders" class="btn btn-dark btn-lg rounded-pill fw-bold">
            THEO DÕI ĐƠN HÀNG
          </button>
          <router-link to="/" class="btn btn-link text-decoration-none text-muted fw-bold"
            >Quay lại trang chủ</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'

const router = useRouter()
const cart = ref([])
const loading = ref(true)
const processing = ref(false)

const delivery = ref({ name: '', phone: '', address: '' })
const paymentMethod = ref('cod')
const voucherCode = ref('')
const discountAmount = ref(0)
const voucherError = ref('')

const showDeleteModal = ref(false)
const showOrderSuccess = ref(false)
const idToDelete = ref(null)

const allSizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]

// === HỆ THỐNG THÔNG BÁO CHUYÊN NGHIỆP ===
const toast = ref({ show: false, message: '', type: 'error', icon: 'bi-x-circle-fill' })
let toastTimer = null

const showNotification = (msg, type = 'error') => {
  toast.value.message = msg
  toast.value.type = type
  toast.value.icon = type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'
  toast.value.show = true

  // Tự động tắt sau 3 giây
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// 1. Fetch dữ liệu
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchCartFromFirebase(user.uid)
    } else {
      router.push('/login')
    }
  })
})

const fetchCartFromFirebase = async (uid) => {
  try {
    const q = query(collection(db, 'carts'), where('userId', '==', uid))
    const querySnapshot = await getDocs(q)

    // SỬA Ở ĐÂY: Đưa id: doc.id ra phía sau để nó không bị ghi đè!
    cart.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))

  } catch {
    showNotification('Không thể tải giỏ hàng, vui lòng thử lại sau!', 'error')
  } finally {
    loading.value = false
  }
}
// 2. Tính toán
const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
const subTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)
const finalTotal = computed(() => Math.max(0, subTotal.value - discountAmount.value))

// 3. Cập nhật Số lượng/Size
const updateCartItem = async (item) => {
  try {
    const itemRef = doc(db, 'carts', item.id)
    await updateDoc(itemRef, { quantity: item.quantity, size: item.size })
    window.dispatchEvent(new Event('cart-updated'))
  } catch {
    showNotification('Lỗi khi cập nhật sản phẩm!', 'error')
  }
}

const changeQty = (item, delta) => {
  if (item.quantity + delta > 0) {
    item.quantity += delta
    updateCartItem(item)
  }
}

const askRemoveItem = (id) => {
  idToDelete.value = id;
  showDeleteModal.value = true;
}

const confirmDelete = async () => {
  if (!idToDelete.value) return;

  try {
    const itemRef = doc(db, 'carts', idToDelete.value);
    await deleteDoc(itemRef);

    cart.value = cart.value.filter((item) => item.id !== idToDelete.value);
    showDeleteModal.value = false;
    idToDelete.value = null;
    window.dispatchEvent(new Event('cart-updated'));
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
  } catch (error) {
    console.error('Lỗi xóa:', error);
    showDeleteModal.value = false;
    showNotification('Không thể xóa sản phẩm lúc này!', 'error');
  }
}

// 5. Voucher
const applyVoucher = () => {
  voucherError.value = ''
  const code = voucherCode.value.trim().toUpperCase()
  if (code === 'SALE50') discountAmount.value = 50
  else if (code === 'NEW10') discountAmount.value = 10
  else {
    discountAmount.value = 0
    voucherError.value = 'Mã không hợp lệ!'
  }
}

// 6. Đặt hàng (Sử dụng thông báo chuyên nghiệp thay vì alert)
const placeOrder = async () => {
  const user = auth.currentUser
  if (!user) return

  // Kiểm tra Validate form chuyên nghiệp
  if (delivery.value.name.trim().split(' ').length < 2) {
    return showNotification('Vui lòng nhập đầy đủ Họ và Tên!', 'error')
  }
  if (!/^[0-9]{10}$/.test(delivery.value.phone)) {
    return showNotification('Số điện thoại không hợp lệ (cần 10 số)!', 'error')
  }
  if (delivery.value.address.trim().length < 5) {
    return showNotification('Vui lòng nhập rõ địa chỉ chi tiết hơn!', 'error')
  }

  processing.value = true
  try {
    await addDoc(collection(db, 'orders'), {
      userId: user.uid,
      orderDate: new Date().toLocaleString('vi-VN'),
      items: JSON.parse(JSON.stringify(cart.value)),
      total: finalTotal.value,
      delivery: delivery.value,
      paymentMethod: paymentMethod.value,
      status: 'Chờ xác nhận',
    })

    const batch = writeBatch(db)
    cart.value.forEach((item) => {
      batch.delete(doc(db, 'carts', item.id))
    })
    await batch.commit()

    cart.value = []
    showOrderSuccess.value = true
    window.dispatchEvent(new Event('cart-updated'))
  } catch {
    showNotification('Đã xảy ra sự cố khi đặt hàng. Vui lòng thử lại!', 'error')
  } finally {
    processing.value = false
  }
}

const goToOrders = () => {
  showOrderSuccess.value = false
  router.push('/orders')
}
</script>

<style scoped>
/* CSS cho Toast Thông báo chuyên nghiệp */
.custom-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 12px;
  color: white;
  z-index: 10000;
  display: flex;
  align-items: center;
  min-width: 250px;
}

.custom-toast.error {
  background-color: #dc3545; /* Đỏ Danger */
  border-left: 5px solid #842029;
}

.custom-toast.success {
  background-color: #198754; /* Xanh Success */
  border-left: 5px solid #0f5132;
}

/* Hiệu ứng trượt cho Toast */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* Các CSS cũ giữ nguyên */
.sticky-summary {
  position: sticky;
  top: 90px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 9999;
}
.modal-content-custom {
  background: white;
  max-width: 450px;
  width: 90%;
  border-radius: 30px !important;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}
.animate-zoom {
  animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.form-control:focus {
  border-color: #ffc107;
  box-shadow: none;
}
</style>
