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
              <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
                <h5 class="fw-bold mb-0">📍 Địa chỉ nhận hàng</h5>
              </div>

              <div class="mb-4 p-3 bg-light rounded-3 border" v-if="savedAddresses.length > 0">
                <label class="form-label small fw-bold text-primary"><i class="bi bi-journal-bookmark-fill"></i> Sổ địa chỉ của bạn</label>
                <select class="form-select border-primary shadow-none fw-bold" v-model="selectedAddressIndex" @change="applySavedAddress">
                  <option value="">➕ Thêm địa chỉ mới</option>
                  <option v-for="(addr, idx) in savedAddresses" :key="idx" :value="idx">
                    {{ addr.name }} | {{ addr.phone }} | {{ addr.address }}
                  </option>
                </select>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Họ và tên</label>
                  <input type="text" class="form-control shadow-none" placeholder="VD: Nguyễn Văn A" v-model="delivery.name" />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Số điện thoại</label>
                  <input type="text" class="form-control shadow-none" placeholder="VD: 0987654321" v-model="delivery.phone" />
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Địa chỉ chi tiết</label>
                  <input type="text" class="form-control shadow-none" placeholder="Số nhà, tên đường, phường/xã..." v-model="delivery.address" />
                </div>

                <div class="col-12 mt-2" v-if="selectedAddressIndex === ''">
                  <div class="form-check form-switch">
                    <input class="form-check-input cursor-pointer" type="checkbox" id="saveAddressCheck" v-model="saveAddress">
                    <label class="form-check-label text-dark fw-bold cursor-pointer small" for="saveAddressCheck">
                      Lưu địa chỉ này cho lần mua sau
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4 border-bottom pb-2">📦 Sản phẩm của bạn</h5>
              <div class="row align-items-center mb-3 pb-3 border-bottom" v-for="item in cart" :key="item.id">
                <div class="col-3 col-md-2">
                  <img :src="item.image" class="img-fluid rounded-3 bg-light p-2 object-fit-contain" :alt="item.name" />
                </div>
                <div class="col-9 col-md-5">
                  <h6 class="fw-bold mb-1">{{ item.name }}</h6>
                  <div class="d-flex align-items-center gap-2 mt-2">
                    <span class="text-muted small">Size:</span>
                    <select class="form-select form-select-sm w-auto shadow-sm fw-bold border-warning" v-model="item.size" @change="updateCartItem(item)">
                      <option v-for="s in allSizes" :key="s" :value="s">Size {{ s }}</option>
                    </select>
                  </div>
                  <p class="text-danger fw-bold mb-0 mt-2">${{ item.price }}</p>
                </div>
                <div class="col-6 col-md-3 mt-3 mt-md-0 d-flex justify-content-md-center">
                  <div class="input-group input-group-sm w-75 shadow-sm">
                    <button class="btn btn-outline-dark" @click="changeQty(item, -1)">-</button>
                    <input type="text" class="form-control text-center fw-bold" :value="item.quantity" readonly />
                    <button class="btn btn-outline-dark" @click="changeQty(item, 1)">+</button>
                  </div>
                </div>
                <div class="col-6 col-md-2 mt-3 mt-md-0 d-flex flex-column align-items-end">
                  <span class="fw-bold text-dark fs-5 mb-2">${{ item.price * item.quantity }}</span>
                  <button class="btn btn-sm btn-danger rounded-pill px-3" @click="askRemoveItem(item.id)">Xóa</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5 col-xl-4">
          <div class="card border-0 shadow-lg rounded-4 bg-dark text-white sticky-summary">
            <div class="card-body p-4">
              <h4 class="fw-bold mb-4 text-warning border-bottom border-secondary pb-3">Tổng Đơn Hàng</h4>

              <div class="mb-4">
                <label class="form-label small text-uppercase text-muted fw-bold">Mã Voucher</label>
                <div class="input-group">
                  <input type="text" class="form-control shadow-none text-uppercase" v-model="voucherCode" placeholder="SALE50" />
                  <button class="btn btn-light fw-bold" @click="applyVoucher">Áp dụng</button>
                </div>
                <small class="text-success mt-1 d-block" v-if="discountAmount > 0">✓ Đã áp dụng giảm ${{ discountAmount }}</small>
                <small class="text-danger mt-1 d-block" v-if="voucherError">{{ voucherError }}</small>
              </div>

              <div class="mb-4">
                <label class="form-label small text-uppercase text-muted fw-bold mb-3">Phương thức thanh toán</label>

                <div class="form-check mb-3">
                  <input class="form-check-input" type="radio" value="cod" v-model="paymentMethod" id="cod" />
                  <label class="form-check-label fw-bold" for="cod">💵 Thanh toán khi nhận hàng</label>
                </div>

                <div class="form-check mb-3">
                  <input class="form-check-input" type="radio" value="card" v-model="paymentMethod" id="card" />
                  <label class="form-check-label fw-bold" for="card">💳 Thẻ tín dụng / Ghi nợ</label>
                  <div v-if="paymentMethod === 'card'" class="mt-2 p-3 bg-secondary bg-opacity-25 rounded-3 animate-fade-in">
                    <input type="text" v-model="creditCardNumber" class="form-control form-control-sm mb-2 shadow-none" placeholder="Số thẻ (VD: 4123 4567 8901 2345)" maxlength="19">
                    <div class="d-flex gap-2">
                      <input type="text" class="form-control form-control-sm shadow-none" placeholder="MM/YY">
                      <input type="password" class="form-control form-control-sm shadow-none" placeholder="CVV" maxlength="3">
                    </div>
                  </div>
                </div>

                <div class="form-check mb-2">
                  <input class="form-check-input" type="radio" value="qr" v-model="paymentMethod" id="qr" />
                  <label class="form-check-label fw-bold text-warning" for="qr">📱 Quét mã VietQR (Ngân hàng/Momo)</label>
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

              <button class="btn btn-warning w-100 rounded-pill fw-bold py-3 text-uppercase fs-5 hover-lift" @click="handleProcessPayment" :disabled="processing">
                {{ processing ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <h1 class="display-1 text-muted mb-3">🛒</h1>
        <h4 class="fw-bold">Giỏ hàng của bạn đang trống</h4>
        <router-link to="/" class="btn btn-dark rounded-pill px-5 mt-3 fw-bold py-2">MUA SẮM NGAY</router-link>
      </div>
    </div>

    <div v-if="showQRPage" class="qr-fullscreen-page d-flex align-items-center justify-content-center">
      <div class="bg-white p-5 rounded-5 shadow-lg text-center mx-3 position-relative" style="max-width: 450px; width: 100%;">
        <button class="btn-close position-absolute top-0 end-0 m-4" @click="cancelQRPayment"></button>

        <h4 class="fw-bold mb-2 text-dark">Thanh toán VietQR</h4>
        <p class="text-muted small mb-4">Mở App Ngân hàng hoặc Momo để quét mã</p>

        <div class="qr-box bg-light p-3 rounded-4 d-inline-block border mb-3 shadow-sm">
          <img :src="vietQrUrl" alt="QR Code Ngân Hàng" class="img-fluid rounded" style="width: 250px; height: 250px; object-fit: contain;">
        </div>

        <div class="mb-4 bg-light p-3 rounded-3 border">
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Ngân hàng:</span>
            <span class="fw-bold small">MB BANK</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Chủ TK:</span>
            <span class="fw-bold small">SHOE STORE</span>
          </div>
          <div class="d-flex justify-content-between border-top pt-2 mt-2">
            <span class="text-muted fw-bold">Số tiền:</span>
            <span class="text-danger fw-bold fs-5">{{ (finalTotal * 25000).toLocaleString('vi-VN') }} VND</span>
          </div>
        </div>

        <div class="d-flex align-items-center justify-content-center gap-2 mb-4 text-primary">
          <div class="spinner-border spinner-border-sm" role="status"></div>
          <span class="fw-bold animate-pulse">Đang chờ thanh toán...</span>
        </div>

        <button class="btn btn-success rounded-pill fw-bold w-100 py-2 shadow-sm" @click="simulatePhonePayment">
          <i class="bi bi-check-circle"></i> Giả lập: Đã chuyển khoản
        </button>
      </div>
    </div>

    <transition name="toast-slide">
      <div v-if="toast.show" class="custom-toast shadow-lg" :class="toast.type">
        <i :class="toast.icon" class="fs-4 me-2"></i>
        <span class="fw-bold">{{ toast.message }}</span>
      </div>
    </transition>

    <div v-if="showDeleteModal" class="modal-overlay d-flex align-items-center justify-content-center">
      <div class="modal-content-custom p-4 text-center rounded-5 shadow-lg animate-zoom">
        <i class="bi bi-trash3 text-danger display-5 mb-3"></i>
        <h5 class="fw-bold">Xóa sản phẩm này?</h5>
        <div class="d-flex gap-2 mt-4">
          <button @click="showDeleteModal = false" class="btn btn-light rounded-pill flex-fill fw-bold">HỦY</button>
          <button @click="confirmDelete" class="btn btn-danger rounded-pill flex-fill fw-bold">XÓA NGAY</button>
        </div>
      </div>
    </div>

    <div v-if="showOrderSuccess" class="modal-overlay d-flex align-items-center justify-content-center" style="z-index: 100000;">
      <div class="modal-content-custom p-5 text-center rounded-5 shadow-lg animate-zoom">
        <div class="celebration-icon mb-4">
          <i class="bi bi-check-all text-white bg-success rounded-circle display-1 px-3 py-1 shadow-lg"></i>
        </div>
        <h2 class="fw-bold text-uppercase">Đặt hàng thành công!</h2>
        <p class="text-muted mb-4">Cảm ơn bạn. Đơn hàng đang được hệ thống xử lý.</p>
        <div class="d-grid gap-2">
          <button @click="goToOrders" class="btn btn-dark btn-lg rounded-pill fw-bold">THEO DÕI ĐƠN HÀNG</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch, setDoc, onSnapshot, getDoc, arrayUnion
} from 'firebase/firestore' // IMPORT arrayUnion và getDoc để lưu địa chỉ

const router = useRouter()
const cart = ref([])
const loading = ref(true)
const processing = ref(false)

// --- BIẾN QUẢN LÝ ĐỊA CHỈ ---
const delivery = ref({ name: '', phone: '', address: '' })
const savedAddresses = ref([]) // Mảng chứa sổ địa chỉ
const selectedAddressIndex = ref('') // ID địa chỉ đang chọn trong dropdown
const saveAddress = ref(false) // Checkbox lưu địa chỉ

const paymentMethod = ref('cod')
const creditCardNumber = ref('')
const voucherCode = ref('')
const discountAmount = ref(0)
const voucherError = ref('')

const showDeleteModal = ref(false)
const showOrderSuccess = ref(false)
const idToDelete = ref(null)

const allSizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]

const showQRPage = ref(false)
const tempTransactionId = ref('')
let qrUnsubscribe = null

// TOAST THÔNG BÁO
const toast = ref({ show: false, message: '', type: 'error', icon: 'bi-x-circle-fill' })
let toastTimer = null

const showNotification = (msg, type = 'error') => {
  toast.value.message = msg; toast.value.type = type;
  toast.value.icon = type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill';
  toast.value.show = true;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000);
}

// 1. TẢI DỮ LIỆU BAN ĐẦU
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await fetchCartFromFirebase(user.uid);
      await fetchUserProfile(user.uid); // Tải sổ địa chỉ của User
    } else {
      router.push('/login');
    }
  })
})

const fetchCartFromFirebase = async (uid) => {
  try {
    const q = query(collection(db, 'carts'), where('userId', '==', uid))
    const querySnapshot = await getDocs(q)
    cart.value = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  } catch {
    showNotification('Không thể tải giỏ hàng!', 'error')
  } finally {
    loading.value = false
  }
}

// TẢI SỔ ĐỊA CHỈ TỪ USER PROFILE
const fetchUserProfile = async (uid) => {
  try {
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap.exists() && userSnap.data().savedAddresses) {
      savedAddresses.value = userSnap.data().savedAddresses;
    }
  } catch (error) {
    console.error("Lỗi tải sổ địa chỉ:", error);
  }
}

// ÁP DỤNG ĐỊA CHỈ TỪ DROPDOWN VÀO FORM
const applySavedAddress = () => {
  if (selectedAddressIndex.value !== '') {
    const addr = savedAddresses.value[selectedAddressIndex.value];
    delivery.value = { ...addr }; // Gán dữ liệu cũ vào ô nhập
  } else {
    delivery.value = { name: '', phone: '', address: '' }; // Xóa trắng để nhập mới
  }
}

const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
const subTotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const finalTotal = computed(() => Math.max(0, subTotal.value - discountAmount.value))

// TẠO LINK ẢNH VIETQR CHUẨN NGÂN HÀNG (API VietQR.io)
const vietQrUrl = computed(() => {
  const amountVND = finalTotal.value * 25000; // Ngân hàng VN dùng VND, giả sử 1$ = 25k VND
  const bankBin = '970422'; // Mã BIN của MB Bank
  const accountNo = '0123456789'; // Điền số tài khoản thật của bạn vào đây (nếu có)
  const accountName = encodeURIComponent('SHOE STORE');
  const addInfo = encodeURIComponent(tempTransactionId.value);
  return `https://img.vietqr.io/image/${bankBin}-${accountNo}-compact2.png?amount=${amountVND}&addInfo=${addInfo}&accountName=${accountName}`;
});

const changeQty = (item, delta) => {
  if (item.quantity + delta > 0) {
    item.quantity += delta; updateCartItem(item);
  }
}
const updateCartItem = async (item) => {
  await updateDoc(doc(db, 'carts', item.id), { quantity: item.quantity, size: item.size });
  window.dispatchEvent(new Event('cart-updated'));
}

const askRemoveItem = (id) => { idToDelete.value = id; showDeleteModal.value = true; }
const confirmDelete = async () => {
  if (!idToDelete.value) return;
  await deleteDoc(doc(db, 'carts', idToDelete.value));
  cart.value = cart.value.filter((item) => item.id !== idToDelete.value);
  showDeleteModal.value = false; idToDelete.value = null;
  window.dispatchEvent(new Event('cart-updated'));
  showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
}

const applyVoucher = () => {
  voucherError.value = ''; const code = voucherCode.value.trim().toUpperCase()
  if (code === 'SALE50') discountAmount.value = 50
  else if (code === 'NEW10') discountAmount.value = 10
  else { discountAmount.value = 0; voucherError.value = 'Mã không hợp lệ!' }
}

const handleProcessPayment = async () => {
  const user = auth.currentUser
  if (!user) return

  if (delivery.value.name.trim().length < 2) return showNotification('Nhập đầy đủ Họ Tên!', 'error')
  if (!/^[0-9]{10}$/.test(delivery.value.phone)) return showNotification('SĐT không hợp lệ!', 'error')
  if (delivery.value.address.trim().length < 5) return showNotification('Nhập rõ địa chỉ!', 'error')

  if (paymentMethod.value === 'card' && creditCardNumber.value.length < 10) {
    return showNotification('Vui lòng nhập đúng số thẻ tín dụng!', 'error')
  }

  if (paymentMethod.value === 'cod' || paymentMethod.value === 'card') {
    await finalizeOrder()
  } else if (paymentMethod.value === 'qr') {
    await startQRPaymentFlow(user.uid)
  }
}

const startQRPaymentFlow = async (userId) => {
  processing.value = true;
  tempTransactionId.value = 'TXN' + Date.now(); // Tạo mã đơn ngắn gọn để quét QR dễ hơn

  try {
    await setDoc(doc(db, 'transactions', tempTransactionId.value), {
      userId: userId, amount: finalTotal.value, status: 'pending', createdAt: new Date().toLocaleString('vi-VN')
    });

    processing.value = false;
    showQRPage.value = true;

    qrUnsubscribe = onSnapshot(doc(db, 'transactions', tempTransactionId.value), (docSnap) => {
      if (docSnap.exists() && docSnap.data().status === 'paid') {
        showNotification('Đã nhận được tiền thanh toán!', 'success');
        qrUnsubscribe();
        showQRPage.value = false;
        finalizeOrder(); // Mạng ngon thì tự nhảy
      }
    });
  } catch  {
    processing.value = false;
    showNotification('Lỗi khởi tạo mã QR!', 'error');
  }
}

// HÀM GIẢ LẬP ĐƯỢC NÂNG CẤP (CHẮC CHẮN CHUYỂN TRANG 100%)
const simulatePhonePayment = async () => {
  try {
    // Ép tắt QR và gọi hàm thanh toán ngay lập tức (Không chờ Firebase Snapshot để tránh kẹt mạng)
    if (qrUnsubscribe) qrUnsubscribe();
    showQRPage.value = false;

    // Cập nhật trạng thái giả trên DB cho xịn
    await updateDoc(doc(db, 'transactions', tempTransactionId.value), { status: 'paid' });

    showNotification('Giao dịch thành công!', 'success');

    // Chuyển thẳng tới bước hoàn tất
    await finalizeOrder();
  } catch  {
    showNotification('Lỗi kết nối khi giả lập', 'error');
  }
}

const cancelQRPayment = () => {
  showQRPage.value = false;
  if (qrUnsubscribe) qrUnsubscribe();
}

const finalizeOrder = async () => {
  processing.value = true
  const user = auth.currentUser

  try {
    // 1. LƯU ĐỊA CHỈ VÀO SỔ NẾU TICK VÀO CHECKBOX
    if (saveAddress.value && selectedAddressIndex.value === '') {
      await updateDoc(doc(db, 'users', user.uid), {
        savedAddresses: arrayUnion(delivery.value)
      });
    }

    // 2. TẠO ĐƠN HÀNG
    let methodText = 'Tiền mặt (COD)';
    if (paymentMethod.value === 'card') methodText = `Thẻ tín dụng (**** ${creditCardNumber.value.slice(-4) || 'xxxx'})`;
    if (paymentMethod.value === 'qr') methodText = 'Chuyển khoản VietQR';

    await addDoc(collection(db, 'orders'), {
      userId: user.uid,
      orderId: Date.now().toString(),
      date: new Date().toLocaleString('vi-VN'),
      items: JSON.parse(JSON.stringify(cart.value)),
      subTotal: subTotal.value,
      discount: discountAmount.value,
      total: finalTotal.value,
      delivery: delivery.value,
      paymentMethod: methodText,
      status: paymentMethod.value === 'cod' ? 'Chờ xác nhận' : 'Đã xác nhận',
    })

    // 3. XÓA GIỎ HÀNG
    const batch = writeBatch(db)
    cart.value.forEach((item) => batch.delete(doc(db, 'carts', item.id)))
    await batch.commit()

    cart.value = []
    showOrderSuccess.value = true // HIỆN MODAL THÀNH CÔNG RỰC RỠ
    window.dispatchEvent(new Event('cart-updated'))
  } catch  {
    showNotification('Lỗi tạo đơn hàng!', 'error')
  } finally {
    processing.value = false
  }
}

const goToOrders = () => {
  showOrderSuccess.value = false;
  router.push('/orders');
}

onUnmounted(() => { if (qrUnsubscribe) qrUnsubscribe(); })
</script>

<style scoped>
.qr-fullscreen-page { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(248, 249, 250, 0.95); backdrop-filter: blur(10px); z-index: 105000; }
.animate-pulse { animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
.hover-lift { transition: transform 0.2s; }
.hover-lift:hover { transform: translateY(-2px); }
.cursor-pointer { cursor: pointer; }
.custom-toast { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 12px; color: white; z-index: 100000; display: flex; align-items: center; min-width: 250px; }
.custom-toast.error { background-color: #dc3545; border-left: 5px solid #842029; }
.custom-toast.success { background-color: #198754; border-left: 5px solid #0f5132; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.4s; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(50px); }
.sticky-summary { position: sticky; top: 90px; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); z-index: 99999; }
.modal-content-custom { background: white; max-width: 450px; width: 90%; border-radius: 30px !important; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-zoom { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
</style>
