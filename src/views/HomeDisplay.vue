<template>
  <div class="home-page">
    <section class="poster-hero mb-5 position-relative">
      <div class="overlay-dark"></div>
      <div class="container h-100 d-flex align-items-center position-relative">
        <div class="text-white col-lg-6">
          <h1 class="display-1 fw-bolder mb-0">STEP UP.</h1>
          <h2 class="display-4 text-warning mb-4">DEFINING STYLE</h2>
          <p class="lead mb-4">
            Chào đón bộ sưu tập Xuân Hè 2026 với những đột phá về công nghệ đệm khí và chất liệu bền vững.
          </p>
          <button class="btn btn-warning btn-lg px-5 rounded-pill fw-bold" @click="scrollToGrid">
            SHOP NOW ↓
          </button>
        </div>
      </div>
    </section>

    <div class="container py-5" id="product-grid">
      <div class="text-center mb-5">
        <h2 class="fw-bold display-5">SẢN PHẨM NỔI BẬT</h2>
        <div class="divider mx-auto"></div>
        <div class="row justify-content-center g-3 mb-4 mt-3">
          <div class="col-md-6 col-lg-4">
            <div class="input-group shadow-sm rounded-pill overflow-hidden">
              <span class="input-group-text bg-white border-end-0 ps-3">🔍</span>
              <input
                type="text"
                class="form-control border-start-0 py-2 shadow-none"
                placeholder="Tìm tên giày (vd: Air Max...)"
                v-model="searchQuery"
              />
            </div>
          </div>

          <div class="col-md-6 col-lg-4 d-flex gap-2">
            <button
              class="btn rounded-pill px-4 fw-bold shadow-sm flex-fill transition-all"
              :class="activeFilter === 'Nam' ? 'btn-dark' : 'btn-outline-dark'"
              @click="setCategory('Nam')"
            >
              Giày Nam
            </button>
            <button
              class="btn rounded-pill px-4 fw-bold shadow-sm flex-fill transition-all"
              :class="activeFilter === 'Nữ' ? 'btn-dark' : 'btn-outline-dark'"
              @click="setCategory('Nữ')"
            >
              Giày Nữ
            </button>

            <button
              class="btn btn-outline-danger rounded-pill px-3 fw-bold shadow-sm transition-all"
              v-if="activeFilter || searchQuery"
              @click="clearFilters"
            >
              Xóa Lọc
            </button>
          </div>
        </div>

        <p class="text-muted fs-5 text-center mb-4" v-if="filteredProducts.length === 0 && !loading">
          🤔 Không tìm thấy sản phẩm nào phù hợp.
        </p>
      </div>

      <div v-if="loading" class="text-center py-5 my-5">
        <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status"></div>
        <p class="mt-3 text-muted fw-bold">Đang tải sản phẩm mới nhất...</p>
      </div>

      <div v-else class="row g-4">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3"
          v-for="shoe in paginatedProducts"
          :key="shoe.id"
        >
          <ShoeCard :item="shoe" @add-to-cart="onAddToCart" @view-detail="goToDetail" />
        </div>
      </div>

      <nav v-if="totalPages > 1 && !loading" class="mt-5 d-flex justify-content-center">
        <ul class="pagination pagination-lg shadow-sm">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link text-dark fw-bold" href="#" @click.prevent="prevPage">&laquo; Trước</a>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a
              class="page-link border-dark text-dark"
              href="#"
              @click.prevent="goToPage(page)"
              :style="currentPage === page ? 'background-color: #343a40; color: white !important;' : ''"
            >{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link text-dark fw-bold" href="#" @click.prevent="nextPage">Sau &raquo;</a>
          </li>
        </ul>
      </nav>
    </div>

    <section class="middle-banner my-5 py-5 overflow-hidden">
      <div class="container">
        <div class="row align-items-center bg-dark text-white rounded-5 g-0 shadow-lg">
          <div class="col-md-6 p-5">
            <span class="text-warning fw-bold text-uppercase">Exclusive Collection</span>
            <h2 class="display-4 fw-bold mt-2">LIMITED EDITION</h2>
            <p class="text-secondary mt-3">
              Những phiên bản giới hạn được săn lùng nhiều nhất năm nay. Nhanh tay sở hữu trước khi cháy hàng!
            </p>
            <button
              class="btn btn-warning btn-lg px-5 rounded-pill fw-bold text-dark w-50"
              @click="scrollToGrid"
            >
              SĂN NGAY ↑
            </button>
          </div>

          <div class="col-md-6 h-100 position-relative">
            <div id="promoCarousel" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner" style="height: 500px">
                <div class="carousel-item active h-100">
                  <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800" class="d-block w-100 h-100 object-fit-cover rounded-end-5" alt="Slide 1" />
                </div>
                <div class="carousel-item h-100">
                  <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600" class="d-block w-100 h-100 object-fit-cover rounded-end-5" alt="Slide 2" />
                </div>
                <div class="carousel-item h-100">
                  <img src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800" class="d-block w-100 h-100 object-fit-cover rounded-end-5" alt="Slide 3" />
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#promoCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#promoCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="showSuccessModal" class="modal-overlay d-flex align-items-center justify-content-center">
        <div class="modal-content-custom p-4 shadow-lg border-0 rounded-5 animate__animated animate__zoomIn">
          <div class="text-center mb-3">
            <div class="success-icon mb-2">
              <i class="bi bi-check-circle-fill text-success display-4"></i>
            </div>
            <h4 class="fw-bold text-uppercase">Thêm Thành Công!</h4>
          </div>

          <div class="row align-items-center bg-light rounded-4 p-3 mb-4 g-3">
            <div class="col-4">
              <img :src="addedProduct.image" class="img-fluid rounded-3 shadow-sm border bg-white" :alt="addedProduct.name">
            </div>
            <div class="col-8">
              <h6 class="fw-bold mb-1">{{ addedProduct.name }}</h6>
              <p class="text-muted small mb-1">Kích cỡ: <span class="badge bg-dark">{{ addedProduct.size }}</span></p>
              <p class="text-danger fw-bold mb-0">${{ addedProduct.price }}</p>
            </div>
          </div>

          <div class="d-grid gap-2">
            <router-link to="/cart" class="btn btn-dark rounded-pill fw-bold py-2" @click="showSuccessModal = false">XEM GIỎ HÀNG</router-link>
            <button @click="showSuccessModal = false" class="btn btn-outline-secondary rounded-pill fw-bold py-2 border-0">TIẾP TỤC MUA SẮM</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ShoeCard from '../components/ShoeCard.vue';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const router = useRouter();
const route = useRoute();

// Dữ liệu sản phẩm từ Firebase
const products = ref([]);
const loading = ref(true); // Biến kiểm soát trạng thái tải dữ liệu

// Biến cho tìm kiếm và lọc
const searchQuery = ref('');
const activeFilter = ref('');

// Biến điều khiển Modal
const showSuccessModal = ref(false);
const addedProduct = ref({});

// HÀM LẤY SẢN PHẨM TỪ FIREBASE (Đã xóa bỏ mockData)
const fetchShoes = async () => {
  loading.value = true;
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const fetchedProducts = [];

    querySnapshot.forEach((doc) => {
      // Đẩy dữ liệu vào mảng, ép kiểu số cho chắc chắn
      const data = doc.data();
      fetchedProducts.push({
        id: doc.id,
        ...data,
        price: Number(data.price),
        oldPrice: Number(data.oldPrice || 0)
      });
    });

    products.value = fetchedProducts;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  } finally {
    loading.value = false;
  }
};

// Tính toán danh sách sản phẩm sau khi LỌC và TÌM KIẾM
const filteredProducts = computed(() => {
  return products.value.filter((shoe) => {
    const matchSearch = shoe.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    let matchCategory = true;

    if (activeFilter.value === 'sale') {
      matchCategory = shoe.oldPrice > shoe.price;
    } else if (activeFilter.value) {
      matchCategory = shoe.category === activeFilter.value;
    }

    return matchSearch && matchCategory;
  });
});

// Phân trang dữa trên danh sách đã lọc (filteredProducts)
const itemsPerPage = 8;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage) || 1);
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

// Hàm xử lý nút lọc
const setCategory = (cat) => {
  activeFilter.value = activeFilter.value === cat ? '' : cat;
  currentPage.value = 1;
};

const clearFilters = () => {
  activeFilter.value = '';
  searchQuery.value = '';
  currentPage.value = 1;
};

// HÀM ÉP CUỘN MƯỢT
const scrollToGrid = () => {
  const target = document.getElementById('product-grid');
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 600;
  let start = null;

  const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const animation = (currentTime) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));
    if (timeElapsed < duration) window.requestAnimationFrame(animation);
  };
  window.requestAnimationFrame(animation);
};

onMounted(() => {
  fetchShoes(); // Gọi lấy dữ liệu thật từ Firebase

  window.addEventListener('scroll-to-products', () => {
    setTimeout(scrollToGrid, 50);
  });
});

watch(() => route.query, (newQuery) => {
  if (Object.keys(newQuery).length > 0) {
    if (newQuery.category) activeFilter.value = newQuery.category;
    if (newQuery.filter === 'sale') activeFilter.value = 'sale';

    currentPage.value = 1;
    setTimeout(scrollToGrid, 300);
  }
}, { immediate: true });

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToGrid();
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToGrid();
  }
};
const goToPage = (page) => {
  currentPage.value = page;
  scrollToGrid();
};

const goToDetail = (item) => {
  router.push(`/product/${item.id}`);
};

// Hàm onAddToCart đã chuẩn logic Firebase của bạn
const onAddToCart = async (item) => {
  const user = auth.currentUser;

  if (!user) {
    alert("⚠️ Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
    router.push('/login');
    return;
  }

  try {
    const q = query(
      collection(db, "carts"),
      where("userId", "==", user.uid),
      where("id", "==", item.id)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const cartDoc = querySnapshot.docs[0];
      const newQty = cartDoc.data().quantity + 1;

      await updateDoc(doc(db, "carts", cartDoc.id), {
        quantity: newQty
      });
    } else {
      await addDoc(collection(db, "carts"), {
        userId: user.uid,
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size || 40,
        quantity: 1
      });
    }

    addedProduct.value = { ...item, size: item.size || 40 };
    showSuccessModal.value = true;
    window.dispatchEvent(new Event('cart-updated'));

    setTimeout(() => { showSuccessModal.value = false; }, 3000);

  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    alert("❌ Có lỗi xảy ra, không thể thêm vào giỏ hàng!");
  }
};

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.category) {
      activeFilter.value = newQuery.category;
    } else if (newQuery.filter === 'sale') {
      activeFilter.value = 'sale';
    } else {
      activeFilter.value = '';
    }
    currentPage.value = 1;

    setTimeout(() => {
      const gridElement = document.getElementById('product-grid');
      if (gridElement && Object.keys(newQuery).length > 0) {
        const y = gridElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  },
  { immediate: true },
);
</script>

<style scoped>
#product-grid {
  scroll-margin-top: 90px;
}
.poster-hero {
  height: 80vh;
  background-image: url('https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
.overlay-dark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
}
.divider {
  width: 100px;
  height: 5px;
  background: #ffc107;
  margin-top: 15px;
  border-radius: 10px;
}
.object-fit-cover {
  object-fit: cover;
}
.transition-all {
  transition: all 0.3s ease;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  z-index: 9999;
  padding: 20px;
}

.modal-content-custom {
  background: white;
  max-width: 400px;
  width: 100%;
  position: relative;
  border: none;
}

.success-icon i {
  filter: drop-shadow(0 4px 10px rgba(25, 135, 84, 0.3));
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.animate__zoomIn {
  animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
