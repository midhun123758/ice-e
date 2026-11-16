import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Volume2, VolumeX, Sparkles, IceCream } from 'lucide-react';
import { isSoundEnabled, toggleSoundState, playScoopPop } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onNavigateToBuilder: () => void;
  onNavigateToFlavors: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onNavigateToBuilder,
  onNavigateToFlavors,
}) => {
  const [soundOn, setSoundOn] = React.useState(true);

  const handleToggleSound = () => {
    const newState = toggleSoundState();
    setSoundOn(newState);
    if (newState) playScoopPop();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg shadow-pink-500/5 border border-white/90 cursor-pointer group"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playScoopPop();
          }}
        >
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-300 group-hover:scale-110 transition-transform duration-300">
            <IceCream className="w-6 h-6 animate-bounce-soft" />
            <motion.div
              className="absolute -top-1 -right-1 text-xs"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              ✨
            </motion.div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-wider text-stone-900 group-hover:text-pink-600 transition-colors">
              ICE <span className="text-pink-500">E</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 -mt-1">
              Cold Craft Co.
            </span>
          </div>
        </motion.div>

        {/* Center Links (Desktop) */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg shadow-stone-200/50 border border-white/90 text-sm font-semibold text-stone-600"
        >
          <button
            onClick={() => {
              onNavigateToFlavors();
              playScoopPop();
            }}
            className="px-4 py-2 rounded-full hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
          >
            Flavors
          </button>
          <button
            onClick={() => {
              onNavigateToBuilder();
              playScoopPop();
            }}
            className="px-4 py-2 rounded-full hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Cone Studio
          </button>
          <a
            href="#story"
            onClick={playScoopPop}
            className="px-4 py-2 rounded-full hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
          >
            Our Recipe
          </a>
          <a
            href="#reviews"
            onClick={playScoopPop}
            className="px-4 py-2 rounded-full hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
          >
            Reviews
          </a>
        </motion.nav>

        {/* Actions: Sound Toggle + Cart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex items-center gap-2.5"
        >
          {/* Sound toggle */}
          <button
            onClick={handleToggleSound}
            aria-label="Toggle playful sound effects"
            title={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-md flex items-center justify-center text-stone-600 hover:text-pink-600 hover:bg-pink-50 active:scale-95 transition-all"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-pink-500" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>

          {/* Cart Trigger */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              onOpenCart();
              playScoopPop();
            }}
            className="relative flex items-center gap-3 bg-stone-900 text-white pl-4 pr-5 py-2.5 rounded-full shadow-xl shadow-stone-900/20 hover:bg-pink-600 transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-pink-300" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-stone-900"
                >
                  {cartCount}
                </motion.span>
              )}
            </div>
            <div className="text-left font-display">
              <span className="text-xs uppercase tracking-wider block text-stone-300 leading-tight">
                Cone Bag
              </span>
              <span className="text-sm font-bold leading-tight">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </header>
  );
};
