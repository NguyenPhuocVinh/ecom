import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, JSX } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ProductsPage from './pages/ProductsPage';
import { Toaster } from '@/components/ui/sonner';
import CategoriesPage from './pages/categories/CategoriesPage';
import StoresPage from './pages/stores/StoresPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
    localStorage.setItem('isAuthenticated', status.toString());
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard onLogout={() => handleLogin(false)} />
            </ProtectedRoute>
          }
        >
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="stores" element={<StoresPage />} />

          {/* Các route con khác */}
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
