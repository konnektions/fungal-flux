import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Toast from './components/Toast';
import ProductModal from './components/ProductModal';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GrowingGuidesPage from './pages/GrowingGuidesPage';
import ShippingInfoPage from './pages/ShippingInfoPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import { Product } from './types';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <Router>
      <ToastProvider>
        <AppContent
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          isProductModalOpen={isProductModalOpen}
          setIsProductModalOpen={setIsProductModalOpen}
          handleProductClick={handleProductClick}
        />
      </ToastProvider>
    </Router>
  );
}

function AppContent({
  isCartOpen,
  setIsCartOpen,
  selectedProduct,
  setSelectedProduct,
  isProductModalOpen,
  setIsProductModalOpen,
  handleProductClick,
}: {
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  isProductModalOpen: boolean;
  setIsProductModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleProductClick: (product: Product) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page: string, category?: string) => {
    if (page === 'shop' && category) {
      navigate(`/shop?category=${category}`);
    } else {
      navigate(page === 'home' ? '/' : `/${page}`);
    }
    window.scrollTo(0, 0);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header
          currentPage={location.pathname}
          onNavigate={handleNavigate}
          onCartOpen={() => setIsCartOpen(true)}
        />

        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage onNavigate={handleNavigate} onProductClick={handleProductClick} />} />
            <Route path="/shop" element={<ShopPage onProductClick={handleProductClick} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/growing-guides" element={<GrowingGuidesPage />} />
            <Route path="/shipping-info" element={<ShippingInfoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            {console.log("App.tsx: /signup route rendered")}
            
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <Routes>
                    <Route path="" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/add" element={<AdminProductForm />} />
                    <Route path="products/:id/edit" element={<AdminProductForm />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <Footer onNavigate={handleNavigate} />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />

        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
        />

        <Toast />
      </div>
    </CartProvider>
  );
}

export default App;