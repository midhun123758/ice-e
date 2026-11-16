import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, Star, ShieldCheck, Flame } from 'lucide-react';
import { playScoopPop, playChime } from '../utils/audio';

interface HeroProps {
  onStartCustomizing: () => void;
  onExploreFlavors: () => void;
}

const HERO_PREVIEWS = [
  {
    name: 'Wild Strawberry Bliss',
    tag: 'Trending Now 🔥',
    gradient: 'from-pink-400 via-rose-300 to-amber-100',
    blobColor: 'rgba(255, 112, 166, 0.35)',
    topScoop: '#FF6F91',
    midScoop: '#FFF0F5',
    botScoop: '#FF9770',
    dripColor: '#E11D48',
    coneColor: '#D4A373',
  },
  {
    name: 'Kyoto Matcha Zen',
    tag: 'Chef Signature 🍵',
    gradient: 'from-emerald-400 via-lime-200 to-amber-100',
    blobColor: 'rgba(112, 214, 188, 0.35)',
    topScoop: '#65A30D',
    midScoop: '#84CC16',
    botScoop: '#FEF08A',
    dripColor: '#3F6212',
    coneColor: '#374151',
  },
  {
    name: 'Midnight Sea Salt Truffle',
    tag: 'Pure Indulgence 🍫',
    gradient: 'from-amber-700 via-stone-600 to-stone-900',
    blobColor: 'rgba(120, 53, 15, 0.35)',
    topScoop: '#451A03',
    midScoop: '#78350F',
    botScoop: '#D97706',
    dripColor: '#291002',
    coneColor: '#B45309',
  },
];

export const Hero: React.FC<HeroProps> = ({ onStartCustomizing, onExploreFlavors }) => {
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const activeHero = HERO_PREVIEWS[activeHeroIdx];

  const handleHeroSwitch = (idx: number) => {
    setActiveHeroIdx(idx);
    playScoopPop();
  };

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 px-4 sm:px-8 flex items-center justify-center overflow-hidden">
      {/* Dynamic Animated Mood Glow Background */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-1000"
        style={{ background: activeHero.blobColor }}
      />

      {/* Floating Animated Confectionery Elements */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-36 left-[8%] hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-pill shadow-xl text-xs font-bold text-stone-700 border border-white"
      >
        <span className="text-xl">🍓</span>
        <span>Wild Mountain Berries</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 16, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-24 left-[12%] hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-pill shadow-xl text-xs font-bold text-stone-700 border border-white"
      >
        <span className="text-xl">🥛</span>
        <span>100% Hokkaido Milk</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-44 right-[10%] hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-pill shadow-xl text-xs font-bold text-stone-700 border border-white"
      >
        <span className="text-xl">✨</span>
        <span>-196°C Nitrogen Flash Churn</span>
      </motion.div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 text-center lg:text-left space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 text-pink-700 text-xs sm:text-sm font-bold tracking-wide border border-pink-200 shadow-sm shadow-pink-200/50">
            <Sparkles className="w-4 h-4 text-pink-500 animate-spin-slow" />
            <span>Next-Generation Artisanal Creamery</span>
          </div>

          {/* Punchy Title */}
          <h1 className="font-display font-black text-5xl sm:text-6xl xl:text-7xl tracking-tight text-stone-900 leading-[1.08]">
            Every scoop is pure{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-amber-500">
              dopamine.
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 250 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              >
                <path
                  d="M2 12C60 4 180 4 248 12"
                  stroke="#FF70A6"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Welcome to <strong className="text-stone-900 font-bold">ICE E</strong>. We handcraft small-batch gelato and frozen confections with silky Hokkaido whole cream, cold-pressed botanical nectars, and crunchy waffle cones rolled fresh every 15 minutes.
          </p>

          {/* Interactive Flavor Preset Pill Buttons */}
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2.5">
              Experience signature moods:
            </span>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {HERO_PREVIEWS.map((flavor, idx) => (
                <button
                  key={flavor.name}
                  onClick={() => handleHeroSwitch(idx)}
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-1.5 ${
                    activeHeroIdx === idx
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-105'
                      : 'bg-white/80 hover:bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: flavor.topScoop }}
                  />
                  {flavor.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onStartCustomizing();
                playChime();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-display font-bold text-lg shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 flex items-center justify-center gap-3 group transition-all"
            >
              <span>Build Your Dream Cone</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onExploreFlavors();
                playScoopPop();
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/90 hover:bg-white text-stone-800 font-bold border border-stone-200/80 shadow-md flex items-center justify-center gap-2 hover:border-pink-300 transition-all"
            >
              <span>Browse All Flavors</span>
            </motion.button>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-6 border-t border-stone-200/70 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-stone-800">4.96/5</span>
              <span>(14,200+ foodies)</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-stone-600">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero Artificial Additives</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Interactive Floating Ice Cream Visual */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, type: 'spring' }}
            className="relative w-full max-w-[400px] aspect-[4/5] flex items-center justify-center"
          >
            {/* Cone Halo Circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className="absolute w-[340px] h-[340px] rounded-full border-2 border-dashed border-pink-300/50"
            />

            {/* Flavor Tag Floating Badge */}
            <motion.div
              key={activeHero.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="absolute top-4 -right-4 z-20 px-3.5 py-1.5 rounded-full bg-white shadow-xl border border-pink-100 flex items-center gap-2 text-xs font-bold text-stone-800"
            >
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>{activeHero.tag}</span>
            </motion.div>

            {/* Floating Like Heart Button */}
            <motion.button
              whileTap={{ scale: 0.75 }}
              onClick={() => {
                setLiked(!liked);
                playScoopPop();
              }}
              className="absolute top-6 left-2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-pink-100 flex items-center justify-center text-stone-400 hover:text-rose-500 transition-colors"
            >
              <Heart
                className={`w-5 h-5 transition-transform duration-200 ${
                  liked ? 'fill-rose-500 text-rose-500 scale-125' : ''
                }`}
              />
            </motion.button>

            {/* The Stacked Animated Ice Cream Visual Container */}
            <motion.div
              animate={{
                y: [0, -14, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative flex flex-col items-center filter drop-shadow-2xl"
            >
              {/* Cherry on top with wiggle */}
              <motion.div
                animate={{ rotate: [-6, 6, -6], y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="text-4xl -mb-3 z-30 select-none cursor-pointer"
                onClick={playScoopPop}
              >
                🍒
              </motion.div>

              {/* Top Scoop */}
              <motion.div
                key={`top-${activeHeroIdx}`}
                initial={{ scale: 0.5, y: -30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="relative w-40 h-32 rounded-[50%_50%_46%_46%] shadow-inner flex items-center justify-center z-20 overflow-hidden"
                style={{
                  backgroundColor: activeHero.topScoop,
                  boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.4), inset 0 -10px 20px rgba(0,0,0,0.15)',
                }}
              >
                {/* Sprinkles across top scoop */}
                <div className="absolute inset-0 opacity-80 pointer-events-none">
                  <div className="absolute top-4 left-6 w-3 h-1 bg-yellow-300 rounded-full rotate-45" />
                  <div className="absolute top-8 left-12 w-3 h-1 bg-white rounded-full -rotate-12" />
                  <div className="absolute top-5 right-8 w-3 h-1 bg-sky-300 rounded-full rotate-24" />
                  <div className="absolute top-10 right-14 w-3 h-1 bg-emerald-300 rounded-full -rotate-45" />
                </div>
                {/* Cute Gloss Highlight */}
                <div className="absolute top-3 left-6 w-12 h-6 bg-white/40 rounded-full blur-[2px] -rotate-12" />
              </motion.div>

              {/* Mid Scoop */}
              <motion.div
                key={`mid-${activeHeroIdx}`}
                initial={{ scale: 0.6, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ delay: 0.08, type: 'spring', stiffness: 350, damping: 20 }}
                className="relative w-44 h-32 rounded-[48%_48%_44%_44%] -mt-10 z-10 overflow-hidden"
                style={{
                  backgroundColor: activeHero.midScoop,
                  boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.3), inset 0 -10px 20px rgba(0,0,0,0.15)',
                }}
              >
                {/* Drip overlay */}
                <motion.div
                  animate={{ height: ['18px', '34px', '18px'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-1 left-10 w-4 rounded-b-full opacity-90"
                  style={{ backgroundColor: activeHero.dripColor }}
                />
                <motion.div
                  animate={{ height: ['12px', '28px', '12px'] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="absolute -top-1 right-12 w-3.5 rounded-b-full opacity-90"
                  style={{ backgroundColor: activeHero.dripColor }}
                />
                <div className="absolute top-4 left-8 w-14 h-6 bg-white/30 rounded-full blur-[2px] -rotate-12" />
              </motion.div>

              {/* Bottom Scoop */}
              <motion.div
                key={`bot-${activeHeroIdx}`}
                initial={{ scale: 0.7, y: -15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ delay: 0.16, type: 'spring', stiffness: 350, damping: 20 }}
                className="relative w-48 h-32 rounded-[46%_46%_42%_42%] -mt-12 z-0 overflow-hidden"
                style={{
                  backgroundColor: activeHero.botScoop,
                  boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.3), inset 0 -10px 20px rgba(0,0,0,0.15)',
                }}
              >
                <div className="absolute top-4 left-10 w-16 h-7 bg-white/25 rounded-full blur-[2px] -rotate-12" />
              </motion.div>

              {/* Waffle Cone with SVG realistic cross-hatch pattern */}
              <div className="relative -mt-8 flex flex-col items-center">
                <svg
                  width="140"
                  height="170"
                  viewBox="0 0 140 170"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="filter drop-shadow-lg"
                >
                  <path
                    d="M10 5 Q70 20 130 5 L70 165 Z"
                    fill={activeHero.coneColor}
                    stroke="#8D4925"
                    strokeWidth="2"
                  />
                  {/* Diagonal grid lines */}
                  <path d="M25 22 L70 165" stroke="#9C522B" strokeWidth="1.5" strokeOpacity="0.6" />
                  <path d="M45 16 L70 165" stroke="#9C522B" strokeWidth="1.5" strokeOpacity="0.6" />
                  <path d="M70 14 L70 165" stroke="#9C522B" strokeWidth="1.5" strokeOpacity="0.6" />
                  <path d="M95 16 L70 165" stroke="#9C522B" strokeWidth="1.5" strokeOpacity="0.6" />
                  <path d="M115 22 L70 165" stroke="#9C522B" strokeWidth="1.5" strokeOpacity="0.6" />

                  {/* Latitudinal arc lines */}
                  <path d="M18 35 Q70 50 122 35" stroke="#683418" strokeWidth="1.5" strokeOpacity="0.4" />
                  <path d="M28 65 Q70 78 112 65" stroke="#683418" strokeWidth="1.5" strokeOpacity="0.4" />
                  <path d="M40 95 Q70 106 100 95" stroke="#683418" strokeWidth="1.5" strokeOpacity="0.4" />
                  <path d="M52 125 Q70 133 88 125" stroke="#683418" strokeWidth="1.5" strokeOpacity="0.4" />
                </svg>
              </div>
            </motion.div>

            {/* Bottom Floating Pill with Taste Highlights */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-4 text-xs font-semibold text-stone-700"
            >
              <div className="flex items-center gap-1.5 text-pink-600">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                <span className="font-bold">{activeHero.name}</span>
              </div>
              <div className="w-[1px] h-4 bg-stone-200" />
              <span className="text-stone-500 font-medium">Fresh Waffle Cone</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
