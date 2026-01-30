import { useState } from "react";
import { auth } from "../services/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider, // Thêm cái này
  signInWithPopup    // Thêm cái này
} from "firebase/auth";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hàm xử lý Đăng nhập bằng Google nhanh
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // Khi dùng Google, Firebase tự lấy thông tin nên không cần form đăng ký
    } catch (err) {
      setError("Không thể kết nối với Google. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
      }
    } catch (err) {
      if (err.code === 'auth/weak-password') setError("Mật khẩu phải từ 6 ký tự!");
      else if (err.code === 'auth/email-already-in-use') setError("Email này đã được đăng ký!");
      else setError("Email hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Decor nền */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-3xl"></div>
      
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-white relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {isLogin ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Form Đăng ký/Đăng nhập thủ công */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative text-slate-700">
              <User className="absolute left-4 top-4 text-slate-400" size={20} />
              <input
                type="text" placeholder="Họ và tên"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                value={displayName} onChange={(e) => setDisplayName(e.target.value)} required
              />
            </div>
          )}

          <div className="relative text-slate-700">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="email" placeholder="Địa chỉ Email"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>

          <div className="relative text-slate-700">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="password" placeholder="Mật khẩu"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký ngay"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        {/* Phân cách */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Hoặc đăng nhập nhanh</span></div>
        </div>

        {/* Nút Đăng nhập Google trực tiếp */}
        <button 
          onClick={handleGoogleSignIn}
          type="button"
          disabled={loading}
          className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Tiếp tục với Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-slate-500 font-medium">
            {isLogin ? "Bạn chưa có tài khoản?" : "Bạn đã có tài khoản?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="ml-2 text-indigo-600 font-black hover:underline"
            >
              {isLogin ? "Đăng ký thủ công" : "Quay lại đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;