import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Plus, Trash2, ShoppingBag, Sparkles, RefreshCw, Check } from 'lucide-react';
import { AVAILABLE_CONES, AVAILABLE_SCOOPS, AVAILABLE_TOPPINGS } from '../data/flavors';
import { ConeOption, ScoopOption, ToppingOption, CartItem } from '../types';
import { playScoopPop, playChime, playSprinkleSparkle } from '../utils/audio';

interface ScoopBuilderProps {
  onAddToCart: (item: CartItem) => void;
}

export const ScoopBuilder: React.FC<ScoopBuilderProps> = ({ onAddToCart }) => {
  const [selectedCone, setSelectedCone] = useState<ConeOption>(AVAILABLE_CONES[0]);
  const [scoops, setScoops] = useState<ScoopOption[]>([
    AVAILABLE_SCOOPS[0], // Strawberry
    AVAILABLE_SCOOPS[4], // Vanilla
  ]);
  const [toppings, setToppings] = useState<ToppingOption[]>([AVAILABLE_TOPPINGS[0]]);
  const [activeTab, setActiveTab] = useState<'scoops' | 'cone' | 'toppings'>('scoops');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Compute total
  const totalPrice =
    selectedCone.price +
    scoops.reduce((sum, s) => sum + s.price, 0) +
    toppings.reduce((sum, t) => sum + t.price, 0);

  const handleAddScoop = (scoop: ScoopOption) => {
    if (scoops.length >= 4) return;
    setScoops([...scoops, scoop]);
    playScoopPop();
  };

  const handleRemoveScoop = (index: number) => {
    setScoops(scoops.filter((_, i) => i !== index));
    playScoopPop();
  };

  const handleToggleTopping = (topping: ToppingOption) => {
    if (toppings.some((t) => t.id === topping.id)) {
      setToppings(toppings.filter((t) => t.id !== topping.id));
    } else {
      setToppings([...toppings, topping]);
      playSprinkleSparkle();
    }
  };

  const handleReset = () => {
    setScoops([AVAILABLE_SCOOPS[0]]);
    setToppings([]);
    setSelectedCone(AVAILABLE_CONES[0]);
    playScoopPop();
  };

  const handleAddCustomToCart = () => {
    if (scoops.length === 0) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#FF70A6', '#FF9770', '#FFD670', '#70D6BC', '#A06CD5'],
    });
    playChime();

    const title = `${scoops.length}-Scoop Custom ${selectedCone.name.split(' ')[0]}`;
    const subtitle = scoops.map((s) => s.name).join(' • ');

    onAddToCart({
      id: `custom-${Date.now()}`,
      title,
      subtitle,
      price: totalPrice,
      quantity: 1,
      color: scoops[scoops.length - 1]?.color || '#FF70A6',
      customDetails: {
        coneName: selectedCone.name,
        scoopNames: scoops.map((s) => s.name),
        toppingNames: toppings.map((t) => t.name),
      },
    });

    setIsAddedSuccess(true);
    setTimeout(() => setIsAddedSuccess(false), 2000);
  };

  return (
    <section id="builder" className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FFF5ED] to-[#FFFDF9] relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 rounded-full bg-pink-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Laboratory</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-stone-900 tracking-tight">
            Build Your Own <span className="text-pink-500">Gravity Cone</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Stack up to 4 velvety scoops, choose artisan-baked cones, and drizzle signature drizzles. Watch your creation assemble in real-time with physics!
          </p>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center Preview Pane (Sticky on Desktop) */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white shadow-2xl shadow-stone-200/50 flex flex-col items-center justify-between min-h-[580px] relative">
            <div className="w-full flex items-center justify-between text-xs font-bold text-stone-400">
              <span>LIVE CONE SIMULATOR</span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-stone-500 hover:text-pink-600 transition-colors"
                title="Reset build"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Visual Canvas of the cone with scoops stacking */}
            <div className="relative w-full flex-1 flex flex-col items-center justify-end pb-4 pt-12">
              {/* Topping Floating Badges over top */}
              <AnimatePresence>
                {toppings.map((top, idx) => (
                  <motion.div
                    key={top.id}
                    initial={{ scale: 0, y: -20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute z-40 px-3 py-1 rounded-full bg-white shadow-md border border-stone-100 text-xs font-bold text-stone-800 flex items-center gap-1.5"
                    style={{
                      top: `${20 + idx * 30}px`,
                      right: idx % 2 === 0 ? '10px' : 'auto',
                      left: idx % 2 !== 0 ? '10px' : 'auto',
                    }}
                  >
                    <span>{top.icon}</span>
                    <span>{top.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Stack Container */}
              <div className="relative flex flex-col items-center">
                {/* Scoops rendered from top (last item in array) to bottom (first) */}
                <div className="flex flex-col-reverse items-center -space-y-12">
                  <AnimatePresence>
                    {scoops.map((scoop, idx) => {
                      // Width increases slightly as scoops go down
                      const widthPx = 140 + idx * 8;
                      const heightPx = 95;
                      return (
                        <motion.div
                          key={`${scoop.id}-${idx}`}
                          initial={{ scale: 0.3, y: -60, rotate: idx % 2 === 0 ? -12 : 12, opacity: 0 }}
                          animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0.2, y: -40, opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 22,
                            mass: 0.8,
                          }}
                          className="relative rounded-[50%_50%_45%_45%] shadow-md flex items-center justify-center cursor-pointer group"
                          style={{
                            width: `${widthPx}px`,
                            height: `${heightPx}px`,
                            backgroundColor: scoop.color,
                            boxShadow: 'inset 0 8px 16px rgba(255,255,255,0.45), inset 0 -8px 16px rgba(0,0,0,0.2)',
                            zIndex: 10 + idx,
                          }}
                          onClick={() => handleRemoveScoop(idx)}
                          title="Click to remove scoop"
                        >
                          {/* Scoop shine */}
                          <div className="absolute top-2 left-4 w-8 h-4 bg-white/40 rounded-full blur-[1px] -rotate-12" />

                          {/* Hover badge to remove */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/20 rounded-[50%_50%_45%_45%] flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[2px]">
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </div>

                          {/* Drip on bottom scoop */}
                          {idx === 0 && (
                            <motion.div
                              animate={{ height: ['8px', '22px', '8px'] }}
                              transition={{ duration: 2.5, repeat: Infinity }}
                              className="absolute -bottom-1 left-7 w-3 rounded-b-full opacity-80"
                              style={{ backgroundColor: scoop.syrupColor }}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {scoops.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-32 flex flex-col items-center justify-center text-stone-400 text-xs font-bold border-2 border-dashed border-stone-200 rounded-3xl p-6 mb-2"
                  >
                    <span>Click a flavor to add your first scoop!</span>
                  </motion.div>
                )}

                {/* Cone Component */}
                <motion.div
                  key={selectedCone.id}
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring' }}
                  className="relative -mt-6 z-0 flex flex-col items-center"
                >
                  <svg
                    width="120"
                    height="150"
                    viewBox="0 0 120 150"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="filter drop-shadow-md"
                  >
                    <path
                      d="M10 5 Q60 18 110 5 L60 145 Z"
                      fill={selectedCone.color}
                      stroke="#00000020"
                      strokeWidth="2"
                    />
                    <path d="M22 20 L60 145" stroke="#00000030" strokeWidth="1.5" />
                    <path d="M40 14 L60 145" stroke="#00000030" strokeWidth="1.5" />
                    <path d="M60 12 L60 145" stroke="#00000030" strokeWidth="1.5" />
                    <path d="M80 14 L60 145" stroke="#00000030" strokeWidth="1.5" />
                    <path d="M98 20 L60 145" stroke="#00000030" strokeWidth="1.5" />

                    <path d="M16 32 Q60 45 104 32" stroke="#00000025" strokeWidth="1.5" />
                    <path d="M26 60 Q60 72 94 60" stroke="#00000025" strokeWidth="1.5" />
                    <path d="M38 88 Q60 98 82 88" stroke="#00000025" strokeWidth="1.5" />
                    <path d="M48 115 Q60 122 72 115" stroke="#00000025" strokeWidth="1.5" />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Bottom summary bar */}
            <div className="w-full pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  {scoops.length} Scoops • {selectedCone.name.split(' ')[0]}
                </span>
                <span className="font-display font-black text-2xl text-stone-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={scoops.length === 0}
                onClick={handleAddCustomToCart}
                className={`px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
                  isAddedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-900 text-white hover:bg-pink-600 disabled:opacity-40 disabled:pointer-events-none'
                }`}
              >
                {isAddedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-pink-300" />
                    <span>Bag This Cone</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Right Selector Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-stone-200/60 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab('scoops')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  activeTab === 'scoops'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                1. Scoops ({scoops.length}/4)
              </button>
              <button
                onClick={() => setActiveTab('cone')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  activeTab === 'cone'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                2. Cone Style
              </button>
              <button
                onClick={() => setActiveTab('toppings')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  activeTab === 'toppings'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                3. Toppings ({toppings.length})
              </button>
            </div>

            {/* Tab 1: Flavors */}
            {activeTab === 'scoops' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                  <span>Choose any flavor to add on top of your cone</span>
                  <span>{4 - scoops.length} slots left</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_SCOOPS.map((scoop) => {
                    const count = scoops.filter((s) => s.id === scoop.id).length;
                    const isMax = scoops.length >= 4;
                    return (
                      <motion.div
                        key={scoop.id}
                        whileHover={!isMax ? { scale: 1.02 } : {}}
                        whileTap={!isMax ? { scale: 0.98 } : {}}
                        onClick={() => handleAddScoop(scoop)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          count > 0
                            ? 'bg-white border-pink-300 shadow-md ring-2 ring-pink-100'
                            : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-pink-200'
                        } ${isMax ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center font-bold text-white text-xs"
                            style={{ backgroundColor: scoop.color }}
                          >
                            {count > 0 && <span className="bg-black/30 px-1.5 py-0.5 rounded-full">{count}x</span>}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-stone-800">{scoop.name}</h4>
                            <span className="text-xs text-stone-500 font-semibold">+${scoop.price.toFixed(2)}</span>
                          </div>
                        </div>

                        <button
                          disabled={isMax}
                          className="w-8 h-8 rounded-full bg-stone-100 hover:bg-pink-500 hover:text-white flex items-center justify-center transition-colors text-stone-600 disabled:opacity-30"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Tab 2: Cone selection */}
            {activeTab === 'cone' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {AVAILABLE_CONES.map((cone) => {
                  const isSelected = selectedCone.id === cone.id;
                  return (
                    <motion.div
                      key={cone.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCone(cone);
                        playScoopPop();
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-stone-900 ring-2 ring-stone-900/10 shadow-lg'
                          : 'bg-white/80 border-stone-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: cone.color }}
                          >
                            🍦
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-stone-900">{cone.name}</h4>
                            <span className="text-xs text-stone-500 font-bold">${cone.price.toFixed(2)}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-2.5 leading-relaxed">
                        {cone.description}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Tab 3: Toppings */}
            {activeTab === 'toppings' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {AVAILABLE_TOPPINGS.map((topping) => {
                  const isSelected = toppings.some((t) => t.id === topping.id);
                  return (
                    <motion.div
                      key={topping.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleToggleTopping(topping)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-pink-50/80 border-pink-300 ring-2 ring-pink-200 shadow-md'
                          : 'bg-white/80 border-stone-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{topping.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-stone-800">{topping.name}</h4>
                          <span className="text-xs text-stone-500 font-semibold">+${topping.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isSelected ? 'bg-pink-500 text-white' : 'border border-stone-300 text-transparent'
                        }`}
                      >
                        ✓
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
