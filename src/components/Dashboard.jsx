import { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import { 
  collection, addDoc, query, where, onSnapshot, 
  deleteDoc, doc, updateDoc, orderBy 
} from "firebase/firestore";
import { Plus, Trash2, CheckCircle, Clock, Search, Filter, LayoutDashboard, LogOut, Calendar as CalendarIcon } from "lucide-react";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "todos"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || todo.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const completedCount = todos.filter(t => t.status === 'completed').length;
  const progressPercent = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      await addDoc(collection(db, "todos"), {
        title: newTodo,
        deadline: deadline,
        status: "pending",
        userId: user.uid,
        createdAt: new Date()
      });
      setNewTodo("");
      setDeadline("");
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* Navbar cao cấp */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <LayoutDashboard className="text-white" size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600">
              TASKFLOW
            </span>
          </div>
          <button 
            onClick={() => auth.signOut()} 
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-bold"
          >
            <LogOut size={18} /> <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 mt-10">
        {/* Banner tiến độ thông minh */}
        <div className="bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-200 mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-indigo-100 font-medium">Chào buổi tối, {user?.displayName || 'Bạn'}!</h2>
            <p className="text-3xl font-bold mt-1">Bạn đã hoàn thành {progressPercent}%</p>
            
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 bg-white/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="bg-white h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="font-black text-sm">{completedCount}/{todos.length}</span>
            </div>
          </div>
          {/* Trang trí nền */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute right-20 bottom-0 w-20 h-20 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Form thêm Task tinh tế */}
        <form onSubmit={addTodo} className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-10 flex flex-wrap sm:flex-nowrap items-center gap-2 group focus-within:ring-2 ring-indigo-100 transition-all">
          <input
            type="text"
            placeholder="Việc cần làm hôm nay..."
            className="flex-1 p-4 bg-transparent outline-hidden font-semibold text-slate-700 placeholder:text-slate-400"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <div className="flex items-center gap-2 px-2 border-l border-slate-100">
            <CalendarIcon size={18} className="text-slate-400" />
            <input
              type="date"
              className="bg-transparent text-slate-500 font-medium outline-hidden py-2"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <button className="bg-slate-900 text-white p-4 rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg flex items-center gap-2 font-bold">
            <Plus size={22} />
          </button>
        </form>

        {/* Thanh tìm kiếm & Lọc */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex items-center px-4 shadow-sm focus-within:border-indigo-400 transition-all">
            <Search className="text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm nhiệm vụ..."
              className="w-full p-3 bg-transparent outline-hidden font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl px-4 flex items-center gap-2 shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="py-3 bg-transparent font-bold text-slate-600 outline-hidden cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chưa xong</option>
              <option value="completed">Đã xong</option>
            </select>
          </div>
        </div>

        {/* Danh sách Task */}
        <div className="space-y-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <div 
                key={todo.id} 
                className={`group flex items-center justify-between p-5 bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  todo.status === 'completed' ? 'border-slate-100 bg-slate-50/50' : 'border-white shadow-sm shadow-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-5">
                  <button 
                    onClick={() => updateDoc(doc(db, "todos", todo.id), { status: todo.status === 'completed' ? 'pending' : 'completed' })}
                    className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm ${
                      todo.status === 'completed' ? 'bg-green-500 border-green-500 text-white shadow-green-100' : 'border-slate-200 bg-white hover:border-indigo-400'
                    }`}
                  >
                    {todo.status === 'completed' && <CheckCircle size={18} />}
                  </button>
                  <div>
                    <h3 className={`text-lg font-bold transition-all ${
                      todo.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                      {todo.title}
                    </h3>
                    {todo.deadline && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 mt-1 uppercase tracking-wider">
                        <Clock size={12} /> Hạn: {todo.deadline}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteDoc(doc(db, "todos", todo.id))} 
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-bold">Danh sách đang trống!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;