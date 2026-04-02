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

      <h5
        class="card-title fw-bold mt-1 cursor-pointer product-name"
        @click="goToDetails"
      >
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
          @click="$emit('add-to-cart', item)"
        >
          🛒 THÊM GIỎ HÀNG
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['add-to-cart', 'view-detail']);

const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600";
};

// Hàm dùng chung cho click vào ảnh và tên
const goToDetails = () => {
  emit('view-detail', props.item);
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

/* Hiệu ứng khi di chuột vào Tên sản phẩm */
.product-name {
  transition: color 0.2s;
}
.product-name:hover {
  color: #ffc107;
  text-decoration: underline;
}

.cursor-pointer {
  cursor: pointer;
}

.img-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-img-top {
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Ảnh giày xoay nhẹ khi hover trông rất chuyên nghiệp */
.shoe-card:hover .card-img-top {
  transform: scale(1.15) rotate(-5deg);
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #000;
}

.action-btn:active {
  transform: scale(0.95);
}
</style>
