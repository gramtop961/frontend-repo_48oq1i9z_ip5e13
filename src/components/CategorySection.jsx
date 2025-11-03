import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  {
    key: 'Sarees',
    image:
      'https://images.unsplash.com/photo-1591348277618-98ebd70cf2c6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    key: 'Chudidars',
    image:
      'https://images.unsplash.com/photo-1604335399105-a0d7b1498a94?q=80&w=1200&auto=format&fit=crop',
  },
  {
    key: 'Bangles',
    image:
      'https://images.unsplash.com/photo-1596461404969-9ae70c1cb9ce?q=80&w=1200&auto=format&fit=crop',
  },
  {
    key: 'Jewellery',
    image:
      'https://images.unsplash.com/photo-1610030469976-96efff889df4?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function CategorySection({ onSelect }) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif text-rose-900">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat.key}
            onClick={() => onSelect?.(cat.key)}
            className="relative group rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-rose-100"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
          >
            <img src={cat.image} alt={cat.key} className="h-28 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/50 to-transparent group-hover:from-rose-900/60 transition pointer-events-none" />
            <div className="absolute bottom-2 left-2 text-white/95 font-medium drop-shadow-sm">
              {cat.key}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
