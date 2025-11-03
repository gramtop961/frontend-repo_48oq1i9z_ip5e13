import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'New Arrivals',
    subtitle: 'Handwoven Sarees',
    image:
      'https://images.unsplash.com/photo-1605022600070-c8aa0c19e53d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Festive Edit',
    subtitle: 'Designer Chudidars',
    image:
      'https://images.unsplash.com/photo-1555679423-7d5f4f8753d1?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Timeless Shine',
    subtitle: 'Bangles & Jewellery',
    image:
      'https://images.unsplash.com/photo-1598908314072-c2a3c9630a1b?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const intervalRef = useRef(null);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const onScroll = () => setOffsetY(window.scrollY * 0.2);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="relative w-full h-[52vh] sm:h-[60vh] rounded-3xl overflow-hidden bg-rose-50/60">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            <img
              src={slides[index].image}
              alt={slides[index].title}
              className="w-full h-full object-cover scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/30 to-white pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,182,193,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,215,0,0.18),transparent_45%)] pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.h1
              className="text-3xl sm:text-5xl font-serif tracking-wide text-rose-900"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {slides[index].title}
            </motion.h1>
            <motion.p
              className="mt-2 text-rose-700/80 sm:text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              {slides[index].subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2">
        {slides.map((s, i) => (
          <button
            aria-label={`Go to slide ${i + 1}`}
            key={s.id}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-10 bg-rose-500' : 'w-4 bg-rose-300'
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center p-3">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-white/70 backdrop-blur-md shadow-lg hover:bg-white transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-rose-700" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center p-3">
        <button
          onClick={next}
          className="p-2 rounded-full bg-white/70 backdrop-blur-md shadow-lg hover:bg-white transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-rose-700" />
        </button>
      </div>
    </div>
  );
}
