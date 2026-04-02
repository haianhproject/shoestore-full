import { createRouter, createWebHistory } from 'vue-router'
import HomeDisplay from '../views/HomeDisplay.vue'

const routes = [
  { path: '/', name: 'home', component: HomeDisplay },
  { path: '/cart', name: 'cart', component: () => import('../views/UserCart.vue') },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('../views/ProductDetail.vue'),
  },
  // Thêm dòng này để tạo đường dẫn Đơn Hàng Của Tôi
  { path: '/orders', name: 'my-orders', component: () => import('../views/MyOrders.vue') },
  // Thêm vào mảng routes
  { path: '/register', component: () => import('../views/RegisterView.vue') },
  { path: '/account', component: () => import('../views/AccountView.vue') },
  { path: '/login', component: () => import('../views/LoginView.vue') },
  { path: '/forgot-password', component: () => import('../views/ForgotPasswordView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
