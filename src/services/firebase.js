// Import các hàm cần thiết
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Thêm dòng này để dùng Auth
import { getFirestore } from "firebase/firestore"; // Thêm dòng này để dùng Database

const firebaseConfig = {
  apiKey: "AIzaSyBdTobJzm4yvxNMzG7FWNqvrjA_4UFnZAk",
  authDomain: "to-do-list-app-b24af.firebaseapp.com",
  projectId: "to-do-list-app-b24af",
  storageBucket: "to-do-list-app-b24af.firebasestorage.app",
  messagingSenderId: "846818616091",
  appId: "1:846818616091:web:366fad693772b4077529be"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ và export chúng
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;