import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Grid2x2, Heart, Settings, MessageCircle } from 'lucide-react';
import HeroSlider from './components/HeroSlider';
import CategorySection from './components/CategorySection';
import ProductGallery from './components/ProductGallery';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('products');
      if (raw) setProducts(JSON.parse(raw));
    } catch {}
  }, []);

  const brandName = 'Aurelia Couture';

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-50/60 text-rose-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-28">
        <header className="sticky top-0 z-30 backdrop-blur bg-white/60 ring-1 ring-rose-100 rounded-b-3xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center py-4">
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-rose-200 to-amber-200 shadow-inner" />
                <h1 className="mt-2 text-lg sm:text-xl font-serif tracking-widest text-rose-900">
                  {brandName}
                </h1>
                <p className="text-xs text-rose-600/80">Boutique Sarees • Chudidars • Jewellery</p>
              </motion.div>
            </div>
          </div>
        </header>

        {activeTab === 'Home' && (
          <main className="mt-6">
            <HeroSlider />
            <CategorySection onSelect={(c) => setSelectedCategory(c)} />
            <ProductGallery
              products={products}
              onEdit={(p) => {
                setActiveTab('Admin');
              }}
            />
          </main>
        )}

        {activeTab === 'Admin' && (
          <main className="mt-6">
            <AdminPanel onChange={(list) => setProducts(list)} />
          </main>
        )}

        <a
          href={`https://wa.me/?text=${encodeURIComponent('Hello! I have a question about your collection.')}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-24 right-4 sm:bottom-8 z-40 px-4 py-2 rounded-full bg-emerald-500 text-white shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" /> Chat
        </a>

        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-6 px-5 py-3 rounded-full bg-white/80 backdrop-blur ring-1 ring-rose-200 shadow-xl">
            <button
              onClick={() => setActiveTab('Home')}
              className={`flex flex-col items-center text-xs ${
                activeTab === 'Home' ? 'text-rose-700' : 'text-rose-500'
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            <button
              onClick={() => setActiveTab('Home')}
              className="flex flex-col items-center text-xs text-rose-500"
            >
              <Grid2x2 className="w-5 h-5" />
              Shop
            </button>
            <button
              onClick={() => setActiveTab('Home')}
              className="flex flex-col items-center text-xs text-rose-500"
            >
              <Heart className="w-5 h-5" />
              Wishlist
            </button>
            <button
              onClick={() => setActiveTab('Admin')}
              className={`flex flex-col items-center text-xs ${
                activeTab === 'Admin' ? 'text-rose-700' : 'text-rose-500'
              }`}
            >
              <Settings className="w-5 h-5" />
              Admin
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
