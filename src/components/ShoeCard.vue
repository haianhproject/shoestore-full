<template>
  <div class="card h-100 border-0 shadow-sm shoe-card overflow-hidden">
    <div class="img-container p-3 cursor-pointer" @click="goToDetails">
      <img
        :src="item.image"
        class="card-img-top"
        :alt="item.name"
        @error="handleImageError"
      >
    </div>

    <div class="card-body text-center d-flex flex-column">
      <small class="text-muted text-uppercase fw-bold">{{ item.category }}</small>

      <h5 class="card-title fw-bold mt-1 cursor-pointer product-name" @click="goToDetails">
        {{ item.name }}
      </h5>

      <div class="d-flex justify-content-center align-items-center gap-2 mt-auto mb-3">
        <span class="text-danger fw-bold fs-5">${{ item.price }}</span>
        <span class="text-muted text-decoration-line-through small" v-if="item.oldPrice">
          ${{ item.oldPrice }}
        </span>
      </div>

      <div class="mt-auto">
        <button
          class="btn btn-dark w-100 rounded-pill fw-bold py-2 action-btn"
          @click="handleAddToCartClick"
        >
          🛒 THÊM GIỎ HÀNG
        </button>
      </div>
    </div>

    <Teleport to="body">

      <div v-if="showSizeModal" class="custom-modal-overlay d-flex align-items-center justify-content-center">
        <div class="custom-modal-content p-4 rounded-5 shadow-lg animate-zoom">
          <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h5 class="fw-bold mb-0">📏 Chọn Kích Cỡ</h5>
            <button class="btn-close" @click="showSizeModal = false"></button>
          </div>

          <div class="d-flex align-items-center gap-3 mb-4 bg-light p-2 rounded-4 border">
            <img :src="item.image" width="60" class="rounded-3 object-fit-contain bg-white border">
            <div class="text-start">
              <h6 class="mb-1 fw-bold">{{ item.name }}</h6>
              <span class="text-danger fw-bold">${{ item.price }}</span>
            </div>
          </div>

          <div class="size-grid mb-4">
            <button
              v-for="size in sizes"
              :key="size"
              class="btn size-btn fw-bold transition-all"
              :class="selectedSize === size ? 'btn-dark shadow' : 'btn-outline-secondary'"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
          <button class="btn btn-warning w-100 rounded-pill fw-bold py-3 text-uppercase" @click="confirmAddToCart">
            Xác nhận thêm
          </button>
        </div>
      </div>

      </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['add-to-cart', 'view-detail']);
const router = useRouter();

const showSizeModal = ref(false);
const selectedSize = ref(40);
const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600";
};

const goToDetails = () => {
  emit('view-detail', props.item);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleAddToCartClick = () => {
  if (!auth.currentUser) {
    router.push('/login');
    scrollToTop();
    return;
  }
  showSizeModal.value = true;
};

const confirmAddToCart = () => {
  // 1. Ẩn modal hỏi Size ngay lập tức
  showSizeModal.value = false;

  // 2. Gom dữ liệu và bắn lên cho cha xử lý (Cha sẽ tự lo việc hiện thông báo Thành công)
  const itemWithSize = { ...props.item, size: selectedSize.value };
  emit('add-to-cart', itemWithSize);
};
</script>

<style scoped>
.shoe-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  background-color: #fff;
}
.shoe-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.12) !important;
}
.product-name { transition: color 0.2s; }
.product-name:hover { color: #ffc107; text-decoration: underline; }
.cursor-pointer { cursor: pointer; }
.img-container { height: 200px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img-top { max-height: 100%; object-fit: contain; transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
.shoe-card:hover .card-img-top { transform: scale(1.15) rotate(-5deg); }
.action-btn { transition: all 0.2s ease; }
.action-btn:hover { background-color: #ffc107; border-color: #ffc107; color: #000; }
.action-btn:active { transform: scale(0.95); }

/* Modal Styles */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 99999;
  display: flex;
}
.custom-modal-content {
  background: white;
  width: 90%;
  max-width: 400px;
  margin: auto;
}
.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
}
.size-btn { height: 40px; border-radius: 10px; }
.animate-zoom { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
</style>
