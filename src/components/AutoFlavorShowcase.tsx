import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowDown } from 'lucide-react';
import { playScoopPop } from '../utils/audio';

export interface RefFlavorSlide {
  id: string;
  word: string;
  title: string;
  desc: string;
  palette: [string, string]; // [inner, outer]
  bowlImage: string;
  ingredients: {
    src: string;
    top: string;
    left: string;
    width: string;
    idleDelay: number;
  }[];
}

const REF_SLIDES: RefFlavorSlide[] = [
  {
    id: 'straw',
    word: 'STRAW',
    title: 'Berry Pure',
    desc: 'Fresh strawberries, creamy scoops, and white chocolate pieces in one smooth, dreamy dessert.',
    palette: ['#8B0024', '#C90035'],
    bowlImage: '/images/ref/bowl-0.png',
    ingredients: [
      { src: '/images/ref/ing-0-1.png', top: '16%', left: '10%', width: '14%', idleDelay: 0 },
      { src: '/images/ref/ing-0-2.png', top: '15%', left: '80%', width: '15%', idleDelay: 0.35 },
      { src: '/images/ref/ing-0-3.png', top: '70%', left: '78%', width: '13%', idleDelay: 0.7 },
    ],
  },
  {
    id: 'banana',
    word: 'BANANA',
    title: 'Banana Crush',
    desc: 'A smooth and creamy banana ice cream made with fresh banana slices. Perfectly satisfying for any time of day.',
    palette: ['#A86A00', '#F0B800'],
    bowlImage: '/images/ref/bowl-2.png',
    ingredients: [
      { src: '/images/ref/ing-2-1.png', top: '18%', left: '11%', width: '14%', idleDelay: 0 },
      { src: '/images/ref/ing-2-2.png', top: '15%', left: '79%', width: '14%', idleDelay: 0.35 },
      { src: '/images/ref/ing-2-3.png', top: '69%', left: '78%', width: '13.5%', idleDelay: 0.7 },
    ],
  },
  {
    id: 'kiwies',
    word: 'KIWIES',
    title: 'Kiwi Flavor',
    desc: 'A smooth and refreshing kiwi ice cream with white chocolate cubes. Rich and revitalizing.',
    palette: ['#01451F', '#3F9418'],
    bowlImage: '/images/ref/bowl-3.png',
    ingredients: [
      { src: '/images/ref/ing-3-1.png', top: '18%', left: '10%', width: '14%', idleDelay: 0 },
      { src: '/images/ref/ing-3-2.png', top: '15%', left: '80%', width: '13.5%', idleDelay: 0.35 },
      { src: '/images/ref/ing-3-3.png', top: '70%', left: '78%', width: '13.5%', idleDelay: 0.7 },
    ],
  },
];

interface AutoFlavorShowcaseProps {
  isActive?: boolean;
  currentFlavorId?: string;
  onGoToHeritage?: () => void;
  onGoToFlavors?: () => void;
  onGoToExperience?: () => void;
  onGoToAbout?: () => void;
  onBackToTop?: () => void;
}

export function AutoFlavorShowcase({
  isActive = true,
  currentFlavorId,
  onGoToHeritage,
  onGoToFlavors,
  onGoToExperience,
  onGoToAbout,
  onBackToTop,
}: AutoFlavorShowcaseProps) {
  const [currentIdx, setCurrentIdx] = useState(2); // Default Kiwi
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  const [windowDims, setWindowDims] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  const total = REF_SLIDES.length;
  const activeSlide = REF_SLIDES[currentIdx] || REF_SLIDES[0];

  useEffect(() => {
    const onResize = () => {
      setWindowDims({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Track scroll position between Flavors (#flavors) and Heritage (#heritage)
  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      const flavorsEl = document.getElementById('flavors');
      if (!flavorsEl) return;

      const fRect = flavorsEl.getBoundingClientRect();
      const winH = window.innerHeight;

      // Progress goes 0 when at top of Flavors to 1 when scrolled to Heritage
      const progress = Math.min(1, Math.max(0, -fRect.top / winH));
      setScrollProgress(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goToSlide = (newIdx: number, dir: number) => {
    setDirection(dir);
    setCurrentIdx((newIdx + total) % total);
  };

  const nextSlide = () => {
    goToSlide(currentIdx + 1, 1);
  };

  const prevSlide = () => {
    goToSlide(currentIdx - 1, -1);
  };

  // 5-Second Automatic Rotation Timer on Flavors Showcase (pauses when scrolled to Heritage)
  useEffect(() => {
    if (!isActive || isPaused || scrollProgress > 0.35) return;

    const interval = setInterval(() => {
      goToSlide(currentIdx + 1, 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, scrollProgress, currentIdx]);

  const EASING = [0.22, 1, 0.36, 1] as const;

  const wordVariants = {
    enter: (dir: number) => ({
      x: `${90 * dir}%`,
      opacity: 0,
    }),
    center: {
      x: '0%',
      opacity: 0.88,
      transition: {
        duration: 1.15,
        ease: EASING,
      },
    },
    exit: (dir: number) => ({
      x: `${-90 * dir}%`,
      opacity: 0,
      transition: {
        duration: 0.9,
        ease: EASING,
      },
    }),
  };

  const infoVariants = {
    enter: {
      y: 35,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.85,
        delay: 0.22,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      y: -22,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const ingVariants = {
    enter: (custom: { dir: number; index: number }) => ({
      scale: 0.4,
      opacity: 0,
      x: 50 * (custom?.dir || 1),
      y: 40,
      rotate: -15 * (custom?.dir || 1),
    }),
    center: (custom: { dir: number; index: number }) => ({
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.85,
        delay: 0.18 + (custom?.index || 0) * 0.22,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    exit: (custom: { dir: number; index: number }) => ({
      scale: 0.5,
      opacity: 0,
      x: -30 * (custom?.dir || 1),
      y: -25,
      transition: {
        duration: 0.45,
        delay: (custom?.index || 0) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const currentBgGradient = `linear-gradient(270deg, ${activeSlide.palette[0]} 0%, ${activeSlide.palette[1]} 100%)`;

  // Horizontal motion parameters:
  // Center is 50vw; left column center is 25vw; difference is -25% of window width
  const targetX = isDesktop ? -windowDims.width * 0.25 : 0;
  const currentBowlX = scrollProgress * targetX;
  const currentBowlScale = 1.0 - scrollProgress * (isDesktop ? 0.08 : 0.28);
  const currentBowlRotate = scrollProgress * -3.5;

  return (
    <div className="relative w-full">
      {/* ========================================================
          SECTION 3: FLAVORS SHOWCASE (#flavors)
          Full-screen 100vh section with active flavor turntable,
          vibrant palette, giant typography, and center bowl!
          ======================================================== */}
      <section
        id="flavors"
        className="relative w-full min-h-screen h-screen overflow-hidden flex items-center justify-center select-none z-10"
        style={{
          background: currentBgGradient,
          transition: 'background 0.85s ease-out',
        }}
      >
        {/* Subtle Ambient Radial Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.22) 100%)',
          }}
        />

        {/* Giant Background Word (STRAW, BERRIES, BANANA, KIWIES) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-[2] transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.8),
          }}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.h1
              key={`word-${activeSlide.id}`}
              custom={direction}
              variants={wordVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-white font-extrabold tracking-tight leading-none whitespace-nowrap select-none will-change-transform drop-shadow-[0_25px_50px_rgba(0,0,0,0.45)]"
              style={{
                fontSize: 'clamp(8rem, 24vw, 27rem)',
                fontFamily: "'Fredoka', cursive, sans-serif",
              }}
            >
              {activeSlide.word}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Floating Botanical Ingredients */}
        <div
          className="absolute inset-0 pointer-events-none z-[15] will-change-transform transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.8),
          }}
        >
          <AnimatePresence custom={direction} mode="popLayout">
            <div key={`ings-${activeSlide.id}`} className="absolute inset-0 pointer-events-none">
              {activeSlide.ingredients.map((ing, i) => (
                <motion.div
                  key={`${activeSlide.id}-ing-${i}`}
                  custom={{ dir: direction, index: i }}
                  variants={ingVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute pointer-events-none select-none will-change-transform"
                  style={{
                    top: ing.top,
                    left: ing.left,
                    width: ing.width,
                  }}
                >
                  <motion.img
                    animate={{
                      y: [0, -12, 0, 10, 0],
                      rotate: [0, 4, 0, -4, 0],
                    }}
                    transition={{
                      duration: 5.5 + i * 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: ing.idleDelay,
                    }}
                    src={ing.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]"
                    draggable={false}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        {/* Side Turntable Bowls (Previous & Next) */}
        <div
          className="relative z-[12] w-full max-w-7xl h-full flex items-center justify-center pointer-events-none transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.8),
          }}
        >
          {REF_SLIDES.map((item, idx) => {
            let diff = idx - currentIdx;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;
            const isCenter = diff === 0;

            if (isCenter) return null;

            let xOffset = 0;
            let scale = 0.55;
            let opacity = 0;
            let zIndex = 5;
            let blur = 'blur(10px)';

            if (diff === -1) {
              xOffset = isDesktop ? -windowDims.width * 0.42 : -260;
              scale = isDesktop ? 0.72 : 0.55;
              opacity = 0.6;
              zIndex = 10;
              blur = 'blur(6px)';
            } else if (diff === 1) {
              xOffset = isDesktop ? windowDims.width * 0.42 : 260;
              scale = isDesktop ? 0.72 : 0.55;
              opacity = 0.6;
              zIndex = 10;
              blur = 'blur(6px)';
            }

            if (Math.abs(diff) > 1) return null;

            return (
              <motion.div
                key={item.id}
                className="absolute flex items-center justify-center will-change-transform pointer-events-auto cursor-pointer"
                animate={{
                  x: xOffset,
                  scale,
                  opacity,
                  filter: blur,
                }}
                transition={{
                  duration: 0.95,
                  ease: EASING,
                }}
                style={{ zIndex }}
                onClick={() => goToSlide(idx, diff > 0 ? 1 : -1)}
                whileHover={{ scale: scale * 1.05, opacity: 0.85 }}
              >
                <img
                  src={item.bowlImage}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-[320px] sm:w-[480px] lg:w-[600px] h-auto object-contain select-none drop-shadow-2xl"
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </div>

        {/* The Master Center Bowl of Flavors (Moves left on scroll) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
          <div
            className="relative flex flex-col items-center justify-center will-change-transform"
            style={{
              transform: `translate3d(${currentBowlX}px, 0px, 0px) scale(${currentBowlScale}) rotate(${currentBowlRotate}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            {/* Ground drop shadow anchored under the bowl */}
            <div
              className="absolute -bottom-6 w-3/4 h-10 bg-black/55 blur-2xl rounded-full pointer-events-none"
              style={{
                opacity: 0.7 - scrollProgress * 0.1,
                transform: `scale(${1.0 - scrollProgress * 0.15})`,
              }}
            />

            <motion.img
              key={activeSlide.id}
              src={activeSlide.bowlImage}
              alt={activeSlide.title}
              initial={{ opacity: 0.85, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="w-[360px] sm:w-[500px] md:w-[620px] lg:w-[740px] xl:w-[820px] max-w-[90vw] h-auto object-contain select-none drop-shadow-[0_35px_60px_rgba(0,0,0,0.55)] cursor-pointer pointer-events-auto"
              onClick={() => {
                if (scrollProgress < 0.25) {
                  nextSlide();
                }
              }}
              draggable={false}
              title="Click bowl to rotate flavor"
            />
          </div>
        </div>

        {/* Bottom-Left Flavor Editorial Card */}
        <div
          className="absolute left-6 sm:left-12 lg:left-16 bottom-8 sm:bottom-12 z-30 max-w-sm sm:max-w-md pointer-events-none text-left will-change-transform transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.8),
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${activeSlide.id}`}
              variants={infoVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Featured Flavor</span>
              </div>

              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none mb-3 drop-shadow-md"
                style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
              >
                {activeSlide.title}
              </h2>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal drop-shadow-sm max-w-sm">
                {activeSlide.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom-Right Navigation Arrows */}
        <div
          className="absolute right-6 sm:right-12 lg:right-16 bottom-8 sm:bottom-12 z-30 flex items-center gap-3 will-change-transform pointer-events-auto transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.8),
          }}
        >
          <button
            onClick={prevSlide}
            aria-label="Previous Flavor"
            className="w-12 h-12 rounded-full border border-white text-white hover:bg-white/20 active:scale-90 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Flavor"
            className="w-12 h-12 rounded-full bg-white/40 hover:bg-white/60 active:scale-90 text-white flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-sm cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom-Center Dots & Scroll Down to Heritage Story */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 will-change-transform pointer-events-auto transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.8),
          }}
        >
          <div className="flex items-center gap-2.5 bg-black/30 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full shadow-lg">
            {REF_SLIDES.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => goToSlide(idx, idx > currentIdx ? 1 : -1)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIdx ? 'w-6 h-2 bg-white shadow-md' : 'w-2 h-2 bg-white/45 hover:bg-white/75'
                }`}
                title={item.title}
              />
            ))}
          </div>

          <button
            onClick={() => {
              playScoopPop();
              onGoToHeritage?.();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white cursor-pointer shadow-lg hover:scale-105 transition-all group"
          >
            <span className="font-medium tracking-wider uppercase text-[11px]">Explore Camerry Story</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform animate-bounce" />
          </button>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: CAMERRY HERITAGE STORY (#heritage)
          Dedicated full-screen 100vh section!
          Shares the exact same vibrant flavor background color.
          Left Column: The active flavor bowl image docks prominently!
          Right Column: Complete Camerry heritage narrative.
          NEVER EMPTY — ALWAYS 100% POPULATED AND GORGEOUS!
          ======================================================== */}
      <section
        id="heritage"
        className="relative w-full min-h-screen h-screen overflow-hidden flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-20 py-16 sm:py-24 select-text z-10"
        style={{
          background: currentBgGradient,
          transition: 'background 0.85s ease-out',
        }}
      >
        {/* Subtle Ambient Radial Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.22) 100%)',
          }}
        />

        {/* Left Column: The Active Main Flavor Bowl Placed on the Left */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center pointer-events-none z-10">
          <div className="relative flex flex-col items-center justify-center will-change-transform">
            {/* Ground drop shadow anchored under the bowl */}
            <div className="absolute -bottom-6 w-3/4 h-10 bg-black/55 blur-2xl rounded-full pointer-events-none opacity-60" />

            <img
              src={activeSlide.bowlImage}
              alt={activeSlide.title}
              className="w-[360px] sm:w-[500px] md:w-[620px] lg:w-[740px] xl:w-[820px] max-w-[90vw] h-auto object-contain select-none drop-shadow-[0_35px_60px_rgba(0,0,0,0.55)] cursor-pointer pointer-events-auto"
              style={{
                transform: `rotate(-3.5deg)`,
              }}
              onClick={() => {
                playScoopPop();
                nextSlide();
              }}
              draggable={false}
              title={activeSlide.title}
            />
          </div>
        </div>

        {/* Right Column: Camerry Heritage Story Description */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center lg:justify-start pointer-events-auto z-10">
          <div className="max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left select-text">
            {/* Decorative Brand Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-6 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Camerry Heritage • Since 1990</span>
            </div>

            {/* Paragraph 1 */}
            <p
              className="text-base sm:text-lg lg:text-[1.18rem] text-white font-normal leading-relaxed sm:leading-loose tracking-wide mb-6 drop-shadow-sm"
              style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
            >
              Once upon a time, a bunch of ice cream fanatics, all of them cousins, came together to create a world full of creamy, delicious and real ice creams. They tinkered with fruits, milk and nuts, adding a fruit here and a nut there to bring to you a range of creamy goodness and exotic flavours. This new world created by these ice-cream chefs is the magical land of Camerry Ice creams!
            </p>

            {/* Paragraph 2 */}
            <p
              className="text-sm sm:text-base lg:text-[1.05rem] text-white/90 font-normal leading-relaxed sm:leading-loose tracking-wide mb-8 drop-shadow-sm"
              style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
            >
              Camerry Ice Cream owes its origins to the Cousins Group, created in 1990 by five closeknit families. Well-known throughout Kerala and in the growing markets of Tamil Nadu and Karnataka for unrivaled freshness and world-class quality.
            </p>

            {/* Action Button to Next Section (The Crunch Experience) */}
            <button
              onClick={() => {
                playScoopPop();
                if (onGoToExperience) onGoToExperience();
                else onGoToAbout?.();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#120803] hover:bg-white/90 font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg cursor-pointer group"
            >
              <span>Explore The Crunch</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AutoFlavorShowcase;
