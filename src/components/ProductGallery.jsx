import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Search,
  SlidersHorizontal,
  X,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const CATEGORIES = ['All', 'Sarees', 'Chudidars', 'Bangles', 'Jewellery'];

function classNames(...c) {
  return c.filter(Boolean).join(' ');
}

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export default function ProductGallery({ products, onEdit }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [wishlist, setWishlist] = useLocalStorage('wishlist', []);
  const [detail, setDetail] = useState(null);

  const visibleProducts = useMemo(() => {
    const list = products.filter((p) => p.visible !== false);
    return list
      .filter((p) => (category === 'All' ? true : p.category === category))
      .filter((p) => p.price <= maxPrice)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
      );
  }, [products, category, maxPrice, query]);

  const toggleWishlist = (id) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  };

  const wishlistItems = useMemo(
    () => products.filter((p) => wishlist.includes(p.id)),
    [products, wishlist]
  );

  return (
    <div className="mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-4 py-2 ring-1 ring-rose-200 shadow-sm w-full sm:max-w-md">
          <Search className="w-4 h-4 text-rose-700/80" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none w-full placeholder:text-rose-400 text-rose-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white/70 rounded-full ring-1 ring-rose-200 p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={classNames(
                  'px-3 py-1.5 rounded-full text-sm transition',
                  category === c
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-rose-700 hover:bg-rose-100'
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/70 rounded-full px-3 py-1.5 ring-1 ring-rose-200">
            <SlidersHorizontal className="w-4 h-4 text-rose-700/80" />
            <input
              type="range"
              min={500}
              max={100000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-rose-500"
            />
            <span className="text-sm text-rose-700/80">Up to ₹{maxPrice}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleProducts.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03 }}
            className="group relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur ring-1 ring-rose-100 shadow-sm hover:shadow-md"
          >
            <div
              onClick={() => setDetail(p)}
              className="aspect-[3/4] w-full overflow-hidden cursor-pointer"
            >
              <img
                src={p.images?.[0]}
                alt={p.name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-rose-900 font-medium line-clamp-1">{p.name}</h3>
                  <p className="text-rose-600 text-sm">₹{p.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => toggleWishlist(p.id)}
                  aria-label="Add to wishlist"
                  className={classNames(
                    'p-2 rounded-full border border-rose-200/70 bg-white/70 backdrop-blur hover:bg-rose-50 transition',
                    wishlist.includes(p.id) && 'bg-rose-600 text-white border-rose-600'
                  )}
                >
                  <Heart className={classNames('w-4 h-4', wishlist.includes(p.id) && 'fill-current')} />
                </button>
              </div>
            </div>
            {p.visible === false && (
              <div className="absolute top-2 left-2 text-xs bg-rose-700 text-white px-2 py-1 rounded-full shadow">Hidden</div>
            )}
          </motion.div>
        ))}
      </div>

      <WishlistBar items={wishlistItems} onOpen={setDetail} onToggleWishlist={toggleWishlist} />

      <ProductDetailModal
        product={detail}
        onClose={() => setDetail(null)}
        onEdit={() => {
          onEdit?.(detail);
          setDetail(null);
        }}
      />
    </div>
  );
}

function WishlistBar({ items, onOpen, onToggleWishlist }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur ring-1 ring-rose-200 shadow-lg hover:shadow-xl text-rose-700"
      >
        <Heart className="w-4 h-4" /> Wishlist ({items.length})
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 w-[90vw] sm:w-[420px] max-h-[60vh] overflow-auto p-3 rounded-2xl bg-white/80 backdrop-blur ring-1 ring-rose-200 shadow-2xl"
          >
            {items.length === 0 ? (
              <p className="text-rose-600 text-sm">Your wishlist is empty.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {items.map((p) => (
                  <div key={p.id} className="relative rounded-xl overflow-hidden ring-1 ring-rose-100">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-full h-24 object-cover cursor-pointer"
                      onClick={() => onOpen(p)}
                    />
                    <button
                      onClick={() => onToggleWishlist(p.id)}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                    >
                      <X className="w-3 h-3 text-rose-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductDetailModal({ product, onClose, onEdit }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [product]);
  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1605022600070-c8aa0c19e53d?q=80&w=1600&auto=format&fit=crop',
  ];

  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hello! I'm interested in ${product.name} (₹${product.price}).`
  )}`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="relative w-full sm:w-[900px] max-h-[88vh] overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white text-rose-900 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow"
          >
            <X className="w-5 h-5 text-rose-700" />
          </button>

          <div className="grid sm:grid-cols-2">
            <div className="relative bg-rose-50/40">
              <img src={images[idx]} alt={product.name} className="w-full h-80 sm:h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5 text-rose-700" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full"
                  >
                    <ChevronRight className="w-5 h-5 text-rose-700" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={classNames('h-1 rounded-full', i === idx ? 'w-10 bg-rose-600' : 'w-4 bg-rose-300')}
                  />
                ))}
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-serif">{product.name}</h3>
                  <p className="mt-1 text-rose-600">{product.category}</p>
                </div>
                <span className="text-xl font-medium">₹{product.price.toLocaleString()}</span>
              </div>
              {product.description && (
                <p className="mt-4 text-rose-700/90 leading-relaxed">{product.description}</p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-full bg-rose-600 text-white shadow hover:shadow-md transition"
                >
                  Enquire Now
                </a>
                <button
                  onClick={onEdit}
                  className="px-5 py-2.5 rounded-full bg-white ring-1 ring-rose-200 text-rose-700 shadow-sm hover:bg-rose-50"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
