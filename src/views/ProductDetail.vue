<template>
  <div class="product-detail-wrapper position-relative">

    <div class="container py-5 mt-3" v-if="product">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-dark text-decoration-none">Trang chủ</router-link>
          </li>
          <li class="breadcrumb-item">
            <a href="#" class="text-dark text-decoration-none" @click.prevent="goCategory(product.category)">
              Giày {{ product.category }}
            </a>
          </li>
          <li class="breadcrumb-item active fw-bold text-uppercase" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="row g-5 mb-5">
        <div class="col-md-6">
          <div class="product-image-container bg-white p-4 rounded-5 shadow-sm border d-flex align-items-center justify-content-center overflow-hidden position-relative">
            <img :src="product.image" class="img-fluid main-img" :alt="product.name" />
            <div class="position-absolute top-0 start-0 m-3" v-if="product.oldPrice">
               <span class="badge bg-danger px-3 py-2 fw-bold shadow-sm">-{{ calculateDiscount(product.price, product.oldPrice) }}%</span>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge bg-danger text-white px-3 py-2 text-uppercase fw-bold shadow-sm">Mall</span>
            <span class="text-primary fw-bold small"><i class="bi bi-patch-check-fill"></i> Chính hãng 100%</span>
          </div>

          <h1 class="fw-bolder mb-2 text-uppercase display-6 text-dark">{{ product.name }}</h1>

          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="text-warning">
              <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
            </div>
            <span class="text-muted border-start ps-3">4.9 Đánh giá</span>
            <span class="text-muted border-start ps-3">3.4k Đã bán</span>
          </div>

          <div class="bg-light p-4 rounded-4 mb-4 border-start border-4 border-warning shadow-sm">
            <div class="d-flex align-items-baseline gap-3">
              <span class="display-5 fw-bold text-danger">${{ product.price }}</span>
              <span class="fs-5 text-muted text-decoration-line-through" v-if="product.oldPrice">${{ product.oldPrice }}</span>
            </div>
          </div>

          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold text-uppercase mb-0">Kích cỡ (Size EU)</h6>
              <a href="#" class="text-primary small text-decoration-none">Hướng dẫn chọn size</a>
            </div>
            <div class="size-grid">
              <button
                v-for="size in [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]"
                :key="size"
                class="btn size-btn fw-bold transition-all"
                :class="selectedSize === size ? 'btn-dark' : 'btn-outline-secondary'"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="row g-3 mt-4">
            <div class="col-sm-6">
              <button class="btn btn-outline-dark btn-lg w-100 rounded-pill fw-bold py-3 hover-lift" @click="addToCart">
                🛒 THÊM GIỎ HÀNG
              </button>
            </div>
            <div class="col-sm-6">
              <button class="btn btn-warning btn-lg w-100 rounded-pill fw-bold text-dark shadow py-3 hover-lift" @click="buyNow">
                💳 MUA NGAY
              </button>
            </div>
          </div>

          <div class="mt-5 p-4 bg-white rounded-4 border-dashed small shadow-sm">
            <div class="row text-center g-2">
              <div class="col-4 border-end">
                  <i class="bi bi-arrow-return-left text-primary fs-4"></i>
                  <p class="mb-0 mt-1">15 ngày đổi trả</p>
              </div>
              <div class="col-4 border-end">
                  <i class="bi bi-shield-check text-success fs-4"></i>
                  <p class="mb-0 mt-1">Chính hãng 100%</p>
              </div>
              <div class="col-4">
                  <i class="bi bi-truck text-danger fs-4"></i>
                  <p class="mb-0 mt-1">Giao hàng miễn phí</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-5 border-top pt-5">
        <div class="col-lg-8">
          <h4 class="fw-bold mb-4 text-uppercase border-bottom pb-2">Chi tiết sản phẩm</h4>
          <div class="text-secondary lh-lg">
            <p>
              Mẫu <strong>{{ product.name }}</strong> được thiết kế tối ưu cho cả phong cách thể thao và thời trang dạo phố.
              Với chất liệu cao cấp cùng công nghệ đệm êm ái, sản phẩm mang lại sự thoải mái tối đa trong từng bước chân.
            </p>
            <ul>
              <li>Thương hiệu: V-STRIDE Official</li>
              <li>Dòng sản phẩm: Premium Collection 2026</li>
              <li>Chất liệu: Da tổng hợp và lưới thoáng khí</li>
              <li>Công nghệ: Đế cao su chống trượt bền bỉ</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="border-top pt-5">
        <h3 class="fw-bold mb-4 text-uppercase">Có Thể Bạn Sẽ Thích</h3>
        <div class="row g-4">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="shoe in relatedProducts" :key="shoe.id">
            <ShoeCard :item="shoe" @add-to-cart="onAddToCartCard" @view-detail="goToDetail" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container py-5 text-center mt-5">
      <h1 class="display-1">🔎</h1>
      <h2 class="fw-bold mt-3">Sản phẩm không tồn tại</h2>
      <router-link to="/" class="btn btn-dark rounded-pill px-5 mt-3">Quay lại Cửa Hàng</router-link>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay d-flex align-items-center justify-content-center">
      <div class="modal-content-custom p-4 shadow-lg rounded-5 animate-zoom">
        <div class="text-center mb-3">
          <i class="bi bi-bag-check-fill text-success display-4"></i>
          <h4 class="fw-bold mt-2">ĐÃ THÊM VÀO GIỎ!</h4>
        </div>
        <div class="row align-items-center bg-light rounded-4 p-3 mb-4" v-if="product">
          <div class="col-4">
            <img :src="product.image" class="img-fluid rounded-3 border bg-white">
          </div>
          <div class="col-8">
            <h6 class="fw-bold mb-1">{{ product.name }}</h6>
            <p class="text-muted small mb-0">Size: <b>{{ selectedSize }}</b></p>
            <p class="text-danger fw-bold mb-0">${{ product.price }}</p>
          </div>
        </div>
        <div class="d-grid gap-2">
          <router-link @click="showSuccessModal = false" to="/cart" class="btn btn-dark rounded-pill fw-bold py-2">THANH TOÁN NGAY</router-link>
          <button @click="showSuccessModal = false" class="btn btn-outline-secondary rounded-pill fw-bold py-2 border-0">TIẾP TỤC MUA SẮM</button>
        </div>
      </div>
    </div>

  </div> </template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShoeCard from '../components/ShoeCard.vue'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const relatedProducts = ref([])
const selectedSize = ref(40)
const showSuccessModal = ref(false)

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

const addToCart = () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || []
  const existingItem = cart.find((i) => i.id === product.value.id && i.size === selectedSize.value)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product.value, quantity: 1, size: selectedSize.value })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
  showSuccessModal.value = true
}

const buyNow = () => {
  addToCart()
  router.push('/cart')
}

const onAddToCartCard = (item) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || []
  const defaultSize = 40
  const existingItem = cart.find((i) => i.id === item.id && i.size === defaultSize)
  if (existingItem) existingItem.quantity += 1
  else cart.push({ ...item, quantity: 1, size: defaultSize })

  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
  alert(`✅ Đã thêm [${item.name}] vào giỏ!`)
}

const goToDetail = (item) => {
  router.push(`/product/${item.id}`)
}

const goCategory = (cat) => {
  router.push({ path: '/', query: { category: cat }})
}
</script>

<style scoped>
.product-image-container {
  min-height: 450px;
  background: radial-gradient(circle, #ffffff 0%, #f1f1f1 100%);
}
.main-img {
  max-height: 380px;
  object-fit: contain;
  transform: rotate(-10deg);
  transition: transform 0.5s ease;
  filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1));
}
.product-image-container:hover .main-img {
  transform: rotate(0deg) scale(1.05);
}
.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
  gap: 12px;
}
.size-btn {
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
.hover-lift:hover {
  transform: translateY(-3px);
  transition: 0.3s;
}
.border-dashed {
  border: 2px dashed #dee2e6 !important;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 9999;
}
.modal-content-custom {
  background: white;
  max-width: 450px;
  width: 90%;
  border: none;
  border-radius: 30px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}
.animate-zoom {
  animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
.celebration-icon i {
  box-shadow: 0 10px 20px rgba(25, 135, 84, 0.4);
}
</style>
