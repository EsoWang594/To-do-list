import { auth, googleProvider } from "../services/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { LogIn } from "lucide-react"; // Đảm bảo đã install lucide-react

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Sau khi đăng nhập xong, Firebase sẽ tự cập nhật User vào Context
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Chào mừng quay lại!</h1>
          <p className="text-gray-500">Quản lý công việc hiệu quả hơn</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b w-1/5"></span>
          <span className="text-xs text-gray-400 uppercase">Hoặc</span>
          <span className="border-b w-1/5"></span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-6 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pjax_loader.gif" alt="" className="w-0" />
          <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" className="w-5 h-5" />
          <span>Tiếp tục với Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;