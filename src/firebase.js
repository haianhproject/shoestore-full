import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth' // Thêm dòng này
import { getFirestore } from 'firebase/firestore' // Thêm dòng này

const firebaseConfig = {
  apiKey: 'AIzaSyBePpIYvOIuJtA7QaJkf6ZHQ9t0MHlXdzA',
  authDomain: 'shoes-795ca.firebaseapp.com',
  projectId: 'shoes-795ca',
  storageBucket: 'shoes-795ca.firebasestorage.app',
  messagingSenderId: '105665912998',
  appId: '1:105665912998:web:8e323d1bad6b49c2ae5467',
}

const app = initializeApp(firebaseConfig)

// Xuất ra để các trang Login/Register có thể gọi tới
export const auth = getAuth(app)
export const db = getFirestore(app)
