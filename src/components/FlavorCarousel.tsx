import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Flame, Sparkles, Plus, Eye, X, Check, Droplets } from 'lucide-react';
import { FLAVORS } from '../data/flavors';
import { Flavor, CartItem } from '../types';
import { playScoopPop, playChime } from '../utils/audio';

interface FlavorCarouselProps {
  onAddToCart: (item: CartItem) => void;
}

export const FlavorCarousel: React.FC<FlavorCarouselProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'popular' | 'fruity' | 'rich'>('all');
  const [selectedFlavorModal, setSelectedFlavorModal] = useState<Flavor | null>(null);
  const [addedFlavorId, setAddedFlavorId] = useState<string | null>(null);

  const filteredFlavors = FLAVORS.filter((f) => {
    if (activeCategory === 'popular') return f.isPopular;
    if (activeCategory === 'fruity') return f.stats.fruitiness > 70;
    if (activeCategory === 'rich') return f.stats.creaminess > 90;
    return true;
  });

  const handleQuickAdd = (flavor: Flavor) => {
    onAddToCart({
      id: `flavor-${flavor.id}-${Date.now()}`,
      title: flavor.name,
      subtitle: 'Single Artisan Scoop in Sugar Waffle',
      price: flavor.price,
      quantity: 1,
      color: flavor.color,
    });
    setAddedFlavorId(flavor.id);
    playChime();
    setTimeout(() => setAddedFlavorId(null), 1800);
  };

  return (
    <section id="flavors" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header & Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Master Churned Selection</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-stone-900 tracking-tight">
            Signature <span className="text-pink-500">Creations</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-lg">
            Infused with real botanicals, sun-ripened fruits, and micro-batch farm cream.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-stone-100/80 p-1.5 rounded-full self-start md:self-auto">
          {[
            { id: 'all', label: 'All Scoops' },
            { id: 'popular', label: 'Popular 🍓' },
            { id: 'fruity', label: 'Fruity 🍊' },
            { id: 'rich', label: 'Decadent 🍫' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                playScoopPop();
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-stone-900 shadow-md scale-105'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Flavors */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredFlavors.map((flavor, index) => {
            const isAdded = addedFlavorId === flavor.id;
            return (
              <motion.div
                key={flavor.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-3xl p-6 border border-stone-100 shadow-xl shadow-stone-200/40 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold border border-pink-100">
                      {flavor.badge || 'Artisan Special'}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{flavor.rating}</span>
                      <span className="text-stone-400">({flavor.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Visual Scoop Display */}
                  <div
                    className="relative w-full h-44 rounded-2xl flex items-center justify-center overflow-hidden mb-5 group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${flavor.color}20, ${flavor.secondaryColor}40)`,
                    }}
                    onClick={() => {
                      setSelectedFlavorModal(flavor);
                      playScoopPop();
                    }}
                  >
                    {/* Glowing circular scoop */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 6 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-28 h-28 rounded-full shadow-2xl relative flex items-center justify-center"
                      style={{
                        backgroundColor: flavor.color,
                        boxShadow: `0 15px 35px ${flavor.color}60, inset 0 8px 16px rgba(255,255,255,0.4)`,
                      }}
                    >
                      {/* Scoop Gloss */}
                      <div className="absolute top-3 left-4 w-10 h-5 bg-white/40 rounded-full blur-[1px] -rotate-12" />
                      <Eye className="w-6 h-6 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>

                    <div className="absolute bottom-2.5 right-3 text-[11px] font-bold text-stone-500 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {flavor.calories} kcal
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-display font-black text-2xl text-stone-900 group-hover:text-pink-600 transition-colors">
                    {flavor.name}
                  </h3>
                  <p className="text-xs font-medium text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {flavor.tagline}
                  </p>

                  {/* Flavor Taste Profile Bars */}
                  <div className="mt-4 space-y-2 pt-3 border-t border-stone-100 text-[11px] font-semibold text-stone-600">
                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span>Creaminess</span>
                        <span className="font-bold">{flavor.stats.creaminess}%</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${flavor.stats.creaminess}%`,
                            backgroundColor: flavor.color,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span>Sweetness</span>
                        <span className="font-bold">{flavor.stats.sweetness}%</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-700"
                          style={{ width: `${flavor.stats.sweetness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Price & Quick Add Button */}
                <div className="flex items-center justify-between pt-5 mt-4 border-t border-stone-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Single Scoop
                    </span>
                    <span className="font-display font-black text-2xl text-stone-900">
                      ${flavor.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedFlavorModal(flavor);
                        playScoopPop();
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                    >
                      Details
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleQuickAdd(flavor)}
                      className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-900 text-white hover:bg-pink-600'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Quick Scoop</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Flavor Detail Modal */}
      <AnimatePresence>
        {selectedFlavorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedFlavorModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-16 h-16 rounded-2xl shadow-md flex items-center justify-center text-3xl"
                  style={{ backgroundColor: selectedFlavorModal.color }}
                >
                  🍦
                </div>
                <div>
                  <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                    {selectedFlavorModal.badge}
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-900">
                    {selectedFlavorModal.name}
                  </h3>
                </div>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                {selectedFlavorModal.description}
              </p>

              {/* Stats breakdown */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-stone-50 p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-stone-400 font-bold block">SWEETNESS</span>
                  <span className="font-display font-bold text-lg text-stone-800">
                    {selectedFlavorModal.stats.sweetness}%
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-bold block">CREAMINESS</span>
                  <span className="font-display font-bold text-lg text-stone-800">
                    {selectedFlavorModal.stats.creaminess}%
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-bold block">FRUITINESS</span>
                  <span className="font-display font-bold text-lg text-stone-800">
                    {selectedFlavorModal.stats.fruitiness}%
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-bold block">CRUNCH LEVEL</span>
                  <span className="font-display font-bold text-lg text-stone-800">
                    {selectedFlavorModal.stats.crunch}%
                  </span>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  Key Natural Ingredients
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedFlavorModal.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-3 py-1 bg-stone-100 rounded-full text-xs font-semibold text-stone-700"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <div>
                  <span className="text-xs text-stone-400 font-bold block">Price</span>
                  <span className="font-display font-black text-3xl text-stone-900">
                    ${selectedFlavorModal.price.toFixed(2)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleQuickAdd(selectedFlavorModal);
                    setSelectedFlavorModal(null);
                  }}
                  className="px-6 py-3 rounded-full bg-stone-900 text-white hover:bg-pink-600 font-bold text-sm shadow-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Bag</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
