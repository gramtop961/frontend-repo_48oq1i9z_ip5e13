import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Plus, Trash2, Upload, Eye, EyeOff, X } from 'lucide-react';

const CATEGORIES = ['Sarees', 'Chudidars', 'Bangles', 'Jewellery'];

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

async function compressImage(file, quality = 0.7, maxW = 1400) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxW / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          const compressedUrl = URL.createObjectURL(blob);
          resolve(compressedUrl);
          URL.revokeObjectURL(url);
        },
        'image/jpeg',
        quality
      );
    };
    img.src = url;
  });
}

export default function AdminPanel({ onChange }) {
  const [products, setProducts] = useLocalStorage('products', []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    onChange?.(products);
  }, [products, onChange]);

  const startNew = () => {
    setEditing({
      id: crypto.randomUUID(),
      name: '',
      price: 0,
      category: 'Sarees',
      images: [],
      description: '',
      visible: true,
      createdAt: new Date().toISOString(),
    });
    setModalOpen(true);
  };

  const startEdit = (p) => {
    setEditing({ ...p });
    setModalOpen(true);
  };

  const remove = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleVisible = (id) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)));
  };

  const save = () => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === editing.id);
      if (exists) return prev.map((p) => (p.id === editing.id ? editing : p));
      return [editing, ...prev];
    });
    setModalOpen(false);
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif text-rose-900">Admin Dashboard</h2>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 text-white shadow hover:shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-2xl overflow-hidden bg-white/70 backdrop-blur ring-1 ring-rose-100 shadow-sm">
            <div className="flex gap-2 overflow-x-auto p-2">
              {(p.images?.length ? p.images : [
                'https://images.unsplash.com/photo-1605022600070-c8aa0c19e53d?q=80&w=1200&auto=format&fit=crop',
              ]).slice(0, 4).map((img, i) => (
                <img key={i} src={img} alt="preview" className="h-24 w-24 object-cover rounded-xl" />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-rose-900">{p.name || 'Unnamed'}</h3>
                  <p className="text-rose-600 text-sm">{p.category} • ₹{p.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisible(p.id)}
                    className="p-2 rounded-full bg-white ring-1 ring-rose-200 hover:bg-rose-50"
                    title={p.visible ? 'Hide' : 'Show'}
                  >
                    {p.visible ? (
                      <Eye className="w-4 h-4 text-rose-700" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-rose-700" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(p)}
                    className="p-2 rounded-full bg-white ring-1 ring-rose-200 hover:bg-rose-50"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-rose-700" />
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="p-2 rounded-full bg-white ring-1 ring-rose-200 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-rose-700" />
                  </button>
                </div>
              </div>
              {p.description && (
                <p className="mt-2 text-rose-700/90 line-clamp-2 text-sm">{p.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <EditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        value={editing}
        setValue={setEditing}
        onSave={save}
      />
    </div>
  );
}

function EditModal({ open, onClose, value, setValue, onSave }) {
  const fileRef = useRef();

  if (!open || !value) return null;

  const onFiles = async (files) => {
    const arr = Array.from(files);
    const urls = await Promise.all(arr.map((f) => compressImage(f)));
    setValue((v) => ({ ...v, images: [...(v.images || []), ...urls] }));
  };

  const removeImage = (idx) => {
    setValue((v) => ({ ...v, images: v.images.filter((_, i) => i !== idx) }));
  };

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
          className="relative w-full sm:w-[820px] max-h-[90vh] overflow-auto rounded-t-3xl sm:rounded-3xl bg-white text-rose-900 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow"
          >
            <X className="w-5 h-5 text-rose-700" />
          </button>

          <div className="p-6">
            <h3 className="text-xl font-serif mb-4">{value?.name ? 'Edit Product' : 'Add Product'}</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-sm text-rose-700/90">Name</span>
                <input
                  value={value.name}
                  onChange={(e) => setValue((v) => ({ ...v, name: e.target.value }))}
                  className="w-full rounded-xl border border-rose-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-rose-700/90">Price (₹)</span>
                <input
                  type="number"
                  value={value.price}
                  onChange={(e) => setValue((v) => ({ ...v, price: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-rose-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-rose-700/90">Category</span>
                <select
                  value={value.category}
                  onChange={(e) => setValue((v) => ({ ...v, category: e.target.value }))}
                  className="w-full rounded-xl border border-rose-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sm text-rose-700/90">Description</span>
                <textarea
                  rows={3}
                  value={value.description}
                  onChange={(e) => setValue((v) => ({ ...v, description: e.target.value }))}
                  className="w-full rounded-xl border border-rose-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </label>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-rose-700/90">Images</span>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600 text-white shadow hover:shadow-md"
                  >
                    <Upload className="w-4 h-4" /> Upload Images
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onFiles(e.target.files)}
                  />
                </div>
                {value.images?.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {value.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden ring-1 ring-rose-100">
                        <img src={img} alt="upload" className="h-24 w-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-white/90 shadow opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4 text-rose-700" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-rose-200 p-6 text-center text-rose-600/80">
                    No images added yet.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-white ring-1 ring-rose-200 text-rose-700 hover:bg-rose-50"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-6 py-2.5 rounded-full bg-rose-700 text-white shadow hover:shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
