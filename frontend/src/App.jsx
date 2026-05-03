import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/SplashScreen";
import { AuthProvider } from "./context/AuthContext";  // ✅ import AuthProvider

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <SplashScreen onComplete={() => setLoading(false)} />
      ) : (
        <BrowserRouter>
          <AuthProvider>   {/* ✅ wrap AppRoutes with AuthProvider */}
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;