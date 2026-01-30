import { auth } from "./services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-indigo-600">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {user ? <Dashboard /> : <Auth />}
    </>
  );
}

export default App;