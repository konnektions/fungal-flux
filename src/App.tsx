import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
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
      <AppContent
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        isProductModalOpen={isProductModalOpen}
        setIsProductModalOpen={setIsProductModalOpen}
        handleProductClick={handleProductClick}
      />
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

  const handleNavigate = (page: string) => {
    navigate(page === 'home' ? '/' : `/${page}`);
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
            <Route path="/" element={<HomePage onNavigate={handleNavigate} onProductClick={handleProductClick} />} />
            <Route path="/shop" element={<ShopPage onProductClick={handleProductClick} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
      </div>
    </CartProvider>
  );
}

export default App;