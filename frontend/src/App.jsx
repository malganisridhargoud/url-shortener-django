import "./App.css";

// react router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// pages import
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";

// components import
import Header from "./components/Header";

// utils import
// PrivateRoutes util
import PrivateRoutes from "./utils/PrivateRoutes";

// login context import
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            {/* Private Routes */}
            <Route element={<PrivateRoutes />}>
              <Route element={<Dashboard />} path="/" exact />
            </Route>

            {/* Public Routes */}
            <Route element={<LoginPage />} path="/login" />
            <Route element={<RegisterPage />} path="/register" />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
