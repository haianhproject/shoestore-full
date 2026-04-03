<template>
  <div class="product-detail-wrapper position-relative">

    <div class="container py-5 mt-3" v-if="product">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-dark text-decoration-none hover-warning"><i class="bi bi-house-door-fill me-1"></i>Trang chủ</router-link>
          </li>
          <li class="breadcrumb-item">
            <a href="#" class="text-dark text-decoration-none hover-warning" @click.prevent="goCategory(product.category)">
              Giày {{ product.category }}
            </a>
          </li>
          <li class="breadcrumb-item active fw-bold text-uppercase text-warning" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="row g-5 mb-5">
        <div class="col-md-6 col-lg-5">
          <div class="product-image-container bg-white p-4 rounded-5 shadow-sm border d-flex align-items-center justify-content-center overflow-hidden position-relative h-100">
            <img :src="product.image" class="img-fluid main-img" :alt="product.name" />

            <div class="position-absolute top-0 start-0 m-4 d-flex flex-column gap-2">
               <span v-if="product.oldPrice" class="badge bg-danger px-3 py-2 fw-bold shadow-sm rounded-pill fs-6">
                 🔥 -{{ calculateDiscount(product.price, product.oldPrice) }}%
               </span>
               <span class="badge bg-dark px-3 py-2 fw-bold shadow-sm rounded-pill">MỚI</span>
            </div>

            <div class="position-absolute top-0 end-0 m-4 d-flex flex-column gap-2">
              <button class="btn btn-light rounded-circle shadow-sm icon-btn"><i class="bi bi-heart"></i></button>
              <button class="btn btn-light rounded-circle shadow-sm icon-btn"><i class="bi bi-share"></i></button>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-7">
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="badge bg-danger text-white px-3 py-1 text-uppercase fw-bold shadow-sm rounded-1">Mall</span>
            <span class="text-primary fw-bold small"><i class="bi bi-patch-check-fill"></i> Chính hãng 100%</span>
            <span class="text-success fw-bold small ms-2"><i class="bi bi-truck"></i> Giao siêu tốc 2H</span>
          </div>

          <h1 class="fw-bolder mb-2 text-uppercase display-5 text-dark letter-spacing-tight">{{ product.name }}</h1>

          <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
            <div class="text-warning fs-5">
              <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
            </div>
            <span class="text-dark fw-bold">4.9 <span class="text-muted fw-normal">(1.2k Đánh giá)</span></span>
            <span class="text-muted border-start ps-3 border-2 border-dark">3.4k Đã bán</span>
          </div>

          <div class="bg-light p-4 rounded-4 mb-4 border-start border-5 border-warning shadow-sm price-box">
            <div class="d-flex align-items-baseline gap-3">
              <span class="display-4 fw-bold text-danger">${{ product.price }}</span>
              <span class="fs-4 text-muted text-decoration-line-through" v-if="product.oldPrice">${{ product.oldPrice }}</span>
              <span class="badge bg-warning text-dark px-2 py-1 ms-auto fw-bold" v-if="product.oldPrice">Tiết kiệm ${{ product.oldPrice - product.price }}</span>
            </div>
          </div>

          <div class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold text-uppercase mb-0 text-dark">Kích cỡ (Size EU)</h6>
              <a href="#" class="text-primary small text-decoration-none fw-bold hover-warning"><i class="bi bi-rulers me-1"></i>Bảng size</a>
            </div>
            <div class="size-grid">
              <button
                v-for="size in [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]"
                :key="size"
                class="btn size-btn fw-bold transition-all"
                :class="selectedSize === size ? 'btn-dark shadow-lg scale-up' : 'btn-outline-secondary'"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-sm-6">
              <button
                class="btn btn-outline-dark btn-lg w-100 rounded-pill fw-bold py-3 hover-lift d-flex align-items-center justify-content-center gap-2"
                @click="addToCart"
                :disabled="isProcessing"
              >
                <span v-if="isProcessing" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-cart-plus fs-5"></i>
                {{ isProcessing ? 'ĐANG THÊM...' : 'THÊM GIỎ HÀNG' }}
              </button>
            </div>
            <div class="col-sm-6">
              <button
                class="btn btn-warning btn-lg w-100 rounded-pill fw-bold text-dark shadow-sm py-3 hover-lift d-flex align-items-center justify-content-center gap-2"
                @click="buyNow"
                :disabled="isProcessing"
              >
                <i class="bi bi-credit-card-fill fs-5"></i> MUA NGAY
              </button>
            </div>
          </div>

          <div class="mt-4 p-3 bg-white rounded-4 border shadow-sm">
            <div class="row text-center g-2">
              <div class="col-4 border-end">
                  <i class="bi bi-arrow-return-left text-primary fs-3"></i>
                  <p class="mb-0 mt-1 small fw-bold">15 ngày đổi trả</p>
              </div>
              <div class="col-4 border-end">
                  <i class="bi bi-shield-check text-success fs-3"></i>
                  <p class="mb-0 mt-1 small fw-bold">Bảo hành 1 năm</p>
              </div>
              <div class="col-4">
                  <i class="bi bi-box-seam text-warning fs-3"></i>
                  <p class="mb-0 mt-1 small fw-bold">Kiểm tra khi nhận</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-5 pt-5 border-top">
        <div class="col-lg-8">
          <h3 class="fw-bold mb-4 text-uppercase border-start border-5 border-warning ps-3">Mô tả sản phẩm</h3>
          <div class="text-secondary lh-lg fs-5">
            <p>
              Mẫu <strong class="text-dark">{{ product.name }}</strong> được thiết kế tối ưu cho cả phong cách thể thao và thời trang dạo phố.
              Sự kết hợp hoàn hảo giữa thiết kế khí động học và vật liệu siêu nhẹ.
            </p>
            <div class="row mt-4">
              <div class="col-md-6">
                <ul class="list-unstyled">
                  <li class="mb-3"><i class="bi bi-check2-circle text-success me-2"></i><strong>Thương hiệu:</strong> V-STRIDE Official</li>
                  <li class="mb-3"><i class="bi bi-check2-circle text-success me-2"></i><strong>Dòng sản phẩm:</strong> Premium 2026</li>
                  <li class="mb-3"><i class="bi bi-check2-circle text-success me-2"></i><strong>Xuất xứ:</strong> Việt Nam</li>
                </ul>
              </div>
              <div class="col-md-6">
                <ul class="list-unstyled">
                  <li class="mb-3"><i class="bi bi-check2-circle text-success me-2"></i><strong>Chất liệu:</strong> Da cao cấp & Flyknit</li>
                  <li class="mb-3"><i class="bi bi-check2-circle text-success me-2"></i><strong>Công nghệ đế:</strong> Air-Boost độc quyền</li>
                  <li class="mb-3"><i class="bi bi-check2-circle text-success me-2"></i><strong>Khối lượng:</strong> Siêu nhẹ 250g</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-top pt-5">
        <h3 class="fw-bold mb-4 text-uppercase border-start border-5 border-warning ps-3">Có Thể Bạn Sẽ Thích</h3>
        <div class="row g-4">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="shoe in relatedProducts" :key="shoe.id">
            <ShoeCard :item="shoe" @add-to-cart="onAddToCartCard" @view-detail="goToDetail" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container py-5 text-center mt-5">
      <h1 class="display-1 text-muted">🔎</h1>
      <h2 class="fw-bold mt-3">Sản phẩm không tồn tại</h2>
      <p class="text-muted">Có vẻ như sản phẩm bạn tìm kiếm đã bị xóa hoặc đường dẫn không đúng.</p>
      <router-link to="/" class="btn btn-warning rounded-pill px-5 mt-3 fw-bold shadow-sm">VỀ TRANG CHỦ</router-link>
    </div>

    <Teleport to="body">
      <div v-if="showSuccessModal" class="modal-overlay d-flex align-items-center justify-content-center">
        <div class="modal-content-custom p-4 shadow-lg rounded-5 animate-zoom bg-white text-center position-relative">

          <button class="btn-close position-absolute top-0 end-0 m-4" @click="showSuccessModal = false"></button>

          <div class="mb-3">
            <div class="d-inline-block bg-success bg-opacity-10 p-3 rounded-circle mb-2">
              <i class="bi bi-bag-check-fill text-success display-4"></i>
            </div>
            <h4 class="fw-bold mt-2 text-dark">ĐÃ THÊM VÀO GIỎ!</h4>
          </div>

          <div class="row align-items-center bg-light rounded-4 p-3 mb-4 border text-start" v-if="product">
            <div class="col-4">
              <img :src="product.image" class="img-fluid rounded-3 bg-white border object-fit-contain p-1">
            </div>
            <div class="col-8">
              <h6 class="fw-bold mb-1 text-truncate">{{ product.name }}</h6>
              <p class="text-muted small mb-1">Kích cỡ: <strong class="text-dark">{{ selectedSize }}</strong></p>
              <p class="text-danger fw-bold fs-5 mb-0">${{ product.price }}</p>
            </div>
          </div>

          <div class="d-grid gap-3">
            <router-link @click="showSuccessModal = false" to="/cart" class="btn btn-dark rounded-pill fw-bold py-3 fs-6 shadow-sm">
              ĐI ĐẾN THANH TOÁN
            </router-link>
            <button @click="showSuccessModal = false" class="btn btn-outline-secondary rounded-pill fw-bold py-2 border-0 hover-gray">
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
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
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShoeCard from '../components/ShoeCard.vue'

// FIREBASE IMPORTS (CRITICAL FOR CART)
import { auth, db } from '../firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const relatedProducts = ref([])
const selectedSize = ref(40)
const showSuccessModal = ref(false)
const isProcessing = ref(false)

// Toast logic
const toast = ref({ show: false, message: '', type: 'error', icon: 'bi-x-circle-fill' })
let toastTimer = null

const showNotification = (msg, type = 'error') => {
  toast.value.message = msg
  toast.value.type = type
  toast.value.icon = type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'
  toast.value.show = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

// MOCK DATA (In a real app, this should come from Firebase too)
const mockData = [
  { id: 1, name: "Nike Air Max 270", price: 150, oldPrice: 190, category: "Nam", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
  { id: 2, name: "Adidas Ultraboost", price: 180, oldPrice: 230, category: "Nam", image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600" },
  { id: 3, name: "Jordan 1 Retro High", price: 210, oldPrice: 280, category: "Nam", image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800" },
  { id: 4, name: "Puma RS-X Bold", price: 130, oldPrice: 170, category: "Nữ", image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600" },
  { id: 5, name: "Vans Old Skool", price: 75, oldPrice: 95, category: "Nữ", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600" },
  { id: 6, name: "Converse Chuck 70", price: 95, oldPrice: 110, category: "Nam", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600" },
  { id: 7, name: "New Balance 574", price: 110, oldPrice: 140, category: "Nữ", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600" },
  { id: 8, name: "Nike Dunk Low Blue", price: 120, oldPrice: 160, category: "Nam", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600" },
  { id: 9, name: "Nike Air Force 1", price: 110, oldPrice: 130, category: "Nam", image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600" },
  { id: 10, name: "Adidas Yeezy 350", price: 320, oldPrice: 400, category: "Nam", image: "https://images.unsplash.com/photo-1586525198428-225f6f12cff5?w=600" },
  { id: 11, name: "Asics Gel-Kayano", price: 160, oldPrice: 190, category: "Nữ", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600" },
  { id: 12, name: "Reebok Classic", price: 85, oldPrice: 105, category: "Nam", image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600" },
  { id: 13, name: "Balenciaga Triple S", price: 950, oldPrice: 1100, category: "Nữ", image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600" },
  { id: 14, name: "Fila Disruptor II", price: 80, oldPrice: 110, category: "Nữ", image: "https://images.unsplash.com/photo-1515347619252-60a4bd4eff4f?w=600" },
  { id: 15, name: "Nike Vaporfly Next%", price: 250, oldPrice: 300, category: "Nam", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600" },
  { id: 16, name: "Adidas Superstar", price: 90, oldPrice: 120, category: "Nữ", image: "https://images.unsplash.com/photo-1589187151032-573a91317445?w=600" }
]

const loadProduct = (id) => {
  product.value = mockData.find((p) => p.id === id)
  if (product.value) {
    relatedProducts.value = mockData
      .filter((p) => p.category === product.value.category && p.id !== id)
      .slice(0, 4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const calculateDiscount = (price, old) => {
  if(!old) return 0
  return Math.round(((old - price) / old) * 100)
}

onMounted(() => {
  loadProduct(Number(route.params.id))
})

watch(() => route.params.id, (newId) => {
  if (newId) loadProduct(Number(newId))
})

// --- THE FIX: SAVING TO FIREBASE INSTEAD OF LOCALSTORAGE ---
const addToCart = async () => {
  const user = auth.currentUser;

  if (!user) {
    // Nếu chưa đăng nhập, chuyển sang trang Login
    showNotification('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'error');
    router.push('/login');
    return;
  }

  isProcessing.value = true;

  try {
    // 1. Kiểm tra xem sản phẩm + size này đã có trong giỏ hàng của user trên Firebase chưa
    const q = query(
      collection(db, 'carts'),
      where('userId', '==', user.uid),
      where('id', '==', product.value.id),
      where('size', '==', selectedSize.value)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // 2. Nếu có rồi -> Tăng số lượng (Cập nhật Document cũ)
      const existingDoc = querySnapshot.docs[0];
      const newQuantity = existingDoc.data().quantity + 1;

      await updateDoc(doc(db, 'carts', existingDoc.id), {
        quantity: newQuantity
      });
    } else {
      // 3. Nếu chưa có -> Tạo Document mới trong Collection 'carts'
      await addDoc(collection(db, 'carts'), {
        userId: user.uid,
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        image: product.value.image,
        size: selectedSize.value,
        quantity: 1
      });
    }

    // Báo cho Navbar cập nhật số lượng
    window.dispatchEvent(new Event('cart-updated'));

    // Hiện modal thành công
    showSuccessModal.value = true;

  } catch (error) {
    console.error("Lỗi thêm vào giỏ hàng:", error);
    showNotification('Đã xảy ra lỗi khi thêm vào giỏ hàng.', 'error');
  } finally {
    isProcessing.value = false;
  }
}

const buyNow = async () => {
  // Đợi hàm addToCart chạy xong (lưu lên Firebase xong) thì mới chuyển trang
  await addToCart();

  // Chỉ chuyển trang nếu giỏ hàng hiện ra thành công (tức là không bị lỗi)
  if (showSuccessModal.value) {
     showSuccessModal.value = false;
     router.push('/cart');
  }
}

// Hàm này dùng cho danh sách "Có thể bạn sẽ thích" bên dưới
const onAddToCartCard = async (itemWithSize) => {
   const user = auth.currentUser;
   if (!user) {
     router.push('/login');
     return;
   }

   try {
      // Lấy size từ item truyền lên (nếu không có thì mặc định 40)
      const sizeToBuy = itemWithSize.size || 40;

      const q = query(
        collection(db, 'carts'),
        where('userId', '==', user.uid),
        where('id', '==', itemWithSize.id),
        where('size', '==', sizeToBuy)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'carts', existingDoc.id), {
          quantity: existingDoc.data().quantity + 1
        });
      } else {
        await addDoc(collection(db, 'carts'), {
          userId: user.uid,
          id: itemWithSize.id,
          name: itemWithSize.name,
          price: itemWithSize.price,
          image: itemWithSize.image,
          size: sizeToBuy,
          quantity: 1
        });
      }

      window.dispatchEvent(new Event('cart-updated'));
      showNotification(`Đã thêm ${itemWithSize.name} vào giỏ!`, 'success');
   } catch {
     showNotification('Lỗi khi thêm vào giỏ hàng.', 'error');
   }
}

const goToDetail = (item) => {
  router.push(`/product/${item.id}`)
}

const goCategory = (cat) => {
  router.push({ path: '/', query: { category: cat }})
}
</script>

<style scoped>
/* GENERAL STYLES */
.letter-spacing-tight { letter-spacing: -1px; }
.hover-warning { transition: color 0.2s; }
.hover-warning:hover { color: #ffc107 !important; }
.hover-gray:hover { background-color: #f8f9fa !important; }
.transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

/* PRODUCT IMAGE */
.product-image-container {
  min-height: 500px;
  background: radial-gradient(circle at center, #ffffff 0%, #f8f9fa 100%);
}
.main-img {
  max-height: 420px;
  object-fit: contain;
  transform: rotate(-10deg) scale(0.95);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 25px 35px rgba(0,0,0,0.15));
}
.product-image-container:hover .main-img {
  transform: rotate(0deg) scale(1.1);
}

/* BUTTONS */
.icon-btn {
  width: 45px; height: 45px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s;
}
.icon-btn:hover { background-color: #ffc107; color: white; border-color: #ffc107; transform: scale(1.1); }
.hover-lift { transition: all 0.2s ease; }
.hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.hover-lift:active { transform: translateY(0); }

/* SIZE GRID */
.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
  gap: 12px;
}
.size-btn {
  height: 48px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
  font-size: 1rem;
}
.scale-up { transform: scale(1.05); }

/* PRICE BOX */
.price-box {
  background: linear-gradient(to right, #f8f9fa, #ffffff);
}

/* MODAL & TOASTS */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);
  z-index: 105000;
}
.modal-content-custom {
  max-width: 420px; width: 95%; border: none;
}
.animate-zoom { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

.custom-toast { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 12px; color: white; z-index: 110000; display: flex; align-items: center; min-width: 250px; }
.custom-toast.error { background-color: #dc3545; border-left: 5px solid #842029; }
.custom-toast.success { background-color: #198754; border-left: 5px solid #0f5132; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.4s; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(50px); }
</style>
