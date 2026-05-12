import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { LanguageProvider } from "./hooks/use-language";
import { AuthProvider } from "./hooks/useAuth";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public pages
import Menu from "./pages/public/Menu";
import Payment from "./pages/public/Payment";
import Feedback from "./pages/public/Feedback";
import About from "./pages/public/About";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import MenuManager from "./pages/admin/MenuManager";
import FeedbackManager from "./pages/admin/FeedbackManager";
import AdminLayout from "./components/AdminLayout";

// Public layout with bottom navigation
function PublicLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Menu />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="feedback" element={<FeedbackManager />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}
