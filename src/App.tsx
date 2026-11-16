import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowDown, Play, Pause } from 'lucide-react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { playScoopPop, playChime } from './utils/audio';

// Code-splitting: Lazy-load heavy below-the-fold sections for instant first paint
const ChocolateScrollExperience = React.lazy(() =>
  import('./components/ChocolateScrollExperience').then((m) => ({ default: m.ChocolateScrollExperience }))
);
const AutoFlavorShowcase = React.lazy(() =>
  import('./components/AutoFlavorShowcase').then((m) => ({ default: m.AutoFlavorShowcase }))
);
const VideoScrollExperience = React.lazy(() =>
  import('./components/VideoScrollExperience').then((m) => ({ default: m.VideoScrollExperience }))
);
const AboutSection = React.lazy(() =>
  import('./components/AboutSection').then((m) => ({ default: m.AboutSection }))
);

interface FlavorItem {
  id: string;
  name: string;
  color: string;
  gradientStops: [string, string];
  bgGradient: string;
  image: string;
  decorImage: string;
  description: string;
  notes: string[];
}

const FLAVORS: FlavorItem[] = [
  {
    id: 'kiwi',
    name: 'Kiwi',
    color: '#3F9418',
    gradientStops: ['#01451F', '#3F9418'],
    bgGradient: 'linear-gradient(270deg, #01451F 0%, #3F9418 100%)',
    image: '/images/kiwi-bowl-circle.png',
    decorImage: '/images/kiwi-decor.png',
    description: 'Crisp kiwi wheels, sweet white grapes, and creamy whole milk custard swirled into a vibrant, revitalizing dessert.',
    notes: ['Crisp Kiwi Wheels', 'Sweet White Grapes', 'Belgian White Chocolate'],
  },
  {
    id: 'banana',
    name: 'Banana',
    color: '#F0B800',
    gradientStops: ['#A86A00', '#F0B800'],
    bgGradient: 'linear-gradient(270deg, #A86A00 0%, #F0B800 100%)',
    image: '/images/banana-bowl-circle.png',
    decorImage: '/images/banana-decor.png',
    description: 'Bright, zesty, and refreshingly tart, this pie features sun-ripened banana slices topped with clouds of toasted marshmallow meringue.',
    notes: ['Sun-ripened Banana Slices', 'Organic Wildflower Honey', 'Crispy Honeycomb'],
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    color: '#C90035',
    gradientStops: ['#8B0024', '#C90035'],
    bgGradient: 'linear-gradient(270deg, #8B0024 0%, #C90035 100%)',
    image: '/images/strawberry-bowl-circle.png',
    decorImage: '/images/strawberry-decor.png',
    description: 'Fresh strawberries, creamy double-churned scoops, and white chocolate pieces in one smooth, dreamy dessert.',
    notes: ['Alpine Strawberries', 'Hokkaido Sweet Milk', 'Berry Compote'],
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    color: '#52301C',
    gradientStops: ['#52301C', '#241105'],
    bgGradient: 'linear-gradient(135deg, #52301C 0%, #241105 50%, #391D12 100%)',
    image: '/images/chocolate-bowl-circle.png',
    decorImage: '/images/chocolate-decor.png',
    description: 'Velvety double-churned Belgian dark chocolate gelato loaded with crunchy chocolate pearls and molten hot fudge drizzle.',
    notes: ['Belgian Dark Cocoa', 'Milk Chocolate Chunks', 'Hot Fudge Drip'],
  },
];

export function App() {
  const [currentIndex, setCurrentIndex] = useState(0); // Default to first flavor (Kiwi)
  const [direction, setDirection] = useState(1);
  const [activeNav, setActiveNav] = useState('HOME');
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);
  const pourContainerRef = useRef<HTMLDivElement>(null);
  const flavorsContainerRef = useRef<HTMLDivElement>(null);

  const [isPourLocked, setIsPourLocked] = useState(false);
  const isPourLockedRef = useRef(false);
  isPourLockedRef.current = isPourLocked;
  const isNavigatingRef = useRef(false);

  const [flavorsProgress, setFlavorsProgress] = useState(0);

  const currentFlavor = FLAVORS[currentIndex];
  const totalItems = FLAVORS.length;

  // Initialize Lenis for luxurious buttery-smooth continuous page scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Handlers for unlocking Section 2 and advancing / rewinding
  const handlePourComplete = () => {
    setIsPourLocked(false);
    isPourLockedRef.current = false;
    if (lenisRef.current) {
      lenisRef.current.start();
    }
    scrollToTarget('#flavors');
  };

  const handlePourRewind = () => {
    setIsPourLocked(false);
    isPourLockedRef.current = false;
    if (lenisRef.current) {
      lenisRef.current.start();
    }
    scrollToTarget('#home');
  };

  // Continuous page scroll tracker & Section 2 full-screen locking director (rAF throttled)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
          const winH = window.innerHeight;

          // 1. Check Section 2 locking condition: when it fully fixes the screen, lock it!
          if (pourContainerRef.current && !isPourLockedRef.current && !isNavigatingRef.current) {
            const rect = pourContainerRef.current.getBoundingClientRect();
            if (Math.abs(rect.top) <= 35) {
              if (lenisRef.current) {
                lenisRef.current.scrollTo(pourContainerRef.current, { immediate: true });
                lenisRef.current.stop();
              }
              setIsPourLocked(true);
              isPourLockedRef.current = true;
              setActiveNav((prev) => (prev !== 'THE POUR' ? 'THE POUR' : prev));
              return;
            }
          }

          // Update top navbar active tab indicator based on natural scroll position
          const scrollY = window.scrollY;
          const pourEl = pourContainerRef.current;
          const flavorsEl = document.getElementById('flavors');
          const heritageEl = document.getElementById('heritage');
          const experienceEl = document.getElementById('experience');
          const aboutEl = document.getElementById('about');

          if (pourEl) {
            const pourTop = pourEl.offsetTop;
            const flavorsTop = flavorsEl ? flavorsEl.offsetTop : pourTop + winH;
            const heritageTop = heritageEl ? heritageEl.offsetTop : flavorsTop + winH;
            const experienceTop = experienceEl ? experienceEl.offsetTop : heritageTop + winH;
            const aboutTop = aboutEl ? aboutEl.offsetTop : experienceTop + winH;

            let nextNav = 'HOME';
            if (scrollY < pourTop - winH * 0.35) {
              nextNav = 'HOME';
            } else if (scrollY < flavorsTop - winH * 0.35) {
              nextNav = 'THE POUR';
            } else if (scrollY < heritageTop - winH * 0.35) {
              nextNav = 'FLAVORS';
            } else if (scrollY < experienceTop - winH * 0.35) {
              nextNav = 'HERITAGE';
            } else if (scrollY < aboutTop - winH * 0.35) {
              nextNav = 'CRUNCH';
            } else {
              nextNav = 'ABOUT';
            }

            setActiveNav((prev) => (prev !== nextNav ? nextNav : prev));
          }
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5-Second Continuous Automatic Flavor Rotation on Hero
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalItems]);

  const toggleAutoPlay = () => {
    playChime();
    setIsAutoPlay((prev) => !prev);
  };

  // Responsive measurements
  const [windowDims, setWindowDims] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDims({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowDims.width <= 768;

  // Angular geometry for curved text and active dot
  const angleStep = isMobile ? 360 / totalItems : Math.min(32, 150 / Math.max(1, totalItems - 1));
  const startAngle = isMobile ? 0 : -((totalItems - 1) / 2) * angleStep;

  const pieSize = isMobile
    ? Math.min(windowDims.width * 0.94, 520)
    : Math.min(windowDims.width * 0.68, 860);
  const ringGap = isMobile ? 42 : 65;
  const ringSize = pieSize + ringGap * 2;
  const centerY = isMobile ? 'calc(100vh - 10px)' : 'calc(100vh - 25px)';

  // Perfectly synchronized flavor change handler
  const goToFlavor = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    playScoopPop();

    let dir = newIndex > currentIndex ? 1 : -1;
    if (currentIndex === totalItems - 1 && newIndex === 0) dir = 1;
    if (currentIndex === 0 && newIndex === totalItems - 1) dir = -1;

    setDirection(dir);
    setCurrentIndex(newIndex);
  };

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + totalItems) % totalItems;
    goToFlavor(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % totalItems;
    goToFlavor(nextIdx);
  };

  // Smooth anchor scrolling helper
  const scrollToTarget = (target: string) => {
    isNavigatingRef.current = true;
    setIsPourLocked(false);
    isPourLockedRef.current = false;
    if (lenisRef.current) {
      lenisRef.current.start();
    }

    const lenis = lenisRef.current;
    if (target === '#home') {
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === '#the-pour') {
      if (pourContainerRef.current) {
        if (lenis) {
          lenis.scrollTo(pourContainerRef.current, {
            duration: 1.2,
            onComplete: () => {
              // Lock onto Section 2 when arrived via navigation
              if (lenisRef.current) lenisRef.current.stop();
              setIsPourLocked(true);
              isPourLockedRef.current = true;
              isNavigatingRef.current = false;
            },
          });
        } else {
          pourContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (target === '#flavors') {
      const el = document.getElementById('flavors');
      if (el) {
        if (lenis) lenis.scrollTo(el, { duration: 1.2 });
        else el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (target === '#heritage') {
      const el = document.getElementById('heritage');
      if (el) {
        if (lenis) lenis.scrollTo(el, { duration: 1.2 });
        else el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (target === '#experience') {
      const el = document.getElementById('experience');
      if (el) {
        if (lenis) lenis.scrollTo(el, { duration: 1.2 });
        else el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (target === '#about') {
      const el = document.getElementById('about');
      if (el) {
        if (lenis) lenis.scrollTo(el, { duration: 1.2 });
        else el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') scrollToTarget('#home');
      if (e.key === '2') scrollToTarget('#the-pour');
      if (e.key === '3') scrollToTarget('#flavors');
      if (e.key === '4') scrollToTarget('#heritage');
      if (e.key === '5') scrollToTarget('#experience');
      if (e.key === '6') scrollToTarget('#about');
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // URL Hash Sync for deep-linking
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#about') scrollToTarget('#about');
      else if (hash === '#heritage') scrollToTarget('#heritage');
      else if (hash === '#flavors' || hash === '#showcase' || hash === '#auto') scrollToTarget('#flavors');
      else if (hash === '#pour' || hash === '#thepour' || hash === '#the-pour') scrollToTarget('#the-pour');
      else if (hash === '#home' || hash === '#hero') scrollToTarget('#home');
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  // Framer Motion turntable settle variants
  const bowlVariants = {
    initial: (dir: number) => ({
      rotate: dir * 45,
      opacity: 0,
      scale: 0.96,
    }),
    animate: {
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.85,
        ease: [0.175, 0.885, 0.32, 1.1],
      },
    },
    exit: (dir: number) => ({
      rotate: -dir * 45,
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.8,
        ease: [0.36, 0, 0.66, -0.56],
      },
    }),
  };

  return (
    <div className="relative w-full min-h-screen text-white font-sans select-none bg-[#120803] overflow-x-clip">
      {/* ========================================================
          GLOBAL PERSISTENT FLOATING NAVIGATION BAR
          ======================================================== */}
      <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8 lg:px-12 pointer-events-none">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Company Logo on the Left Side */}
          <div className="pointer-events-auto">
            <button
              onClick={() => {
                setActiveNav('HOME');
                playChime();
                scrollToTarget('#home');
              }}
              className="group flex items-center gap-2.5 bg-black/65 hover:bg-black/85 backdrop-blur-xl border border-white/20 px-3.5 sm:px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              title="ICE - E Artisanal Confectionery"
            >
              {/* Logo Emblem Icon */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/30 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-sm sm:text-base select-none">🍨</span>
              </div>

              {/* Logo Typography in Fredoka Font */}
              <div className="flex flex-col text-left">
                <span
                  className="text-base sm:text-lg font-black tracking-wider text-white leading-none group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
                >
                  ICE <span className="text-amber-400 font-black">•</span> E
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-white/60 leading-none mt-0.5">
                  Artisanal Craft
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links in Center */}
          <nav className="pointer-events-auto bg-black/60 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/20 hidden md:flex items-center gap-1 shadow-2xl">
            {[
              { name: 'HOME', target: '#home' },
              { name: 'THE POUR', target: '#the-pour' },
              { name: 'FLAVORS', target: '#flavors' },
              { name: 'HERITAGE', target: '#heritage' },
              { name: 'CRUNCH', target: '#experience' },
              { name: 'ABOUT', target: '#about' },
            ].map((item) => {
              const isActive = activeNav === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveNav(item.name);
                    playChime();
                    scrollToTarget(item.target);
                  }}
                  className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-md font-bold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}

            <div className="w-[1px] h-4 bg-white/20 mx-1" />

            {/* In-Nav Auto Tour Controller */}
            <button
              onClick={toggleAutoPlay}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                isAutoPlay
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-white shadow-md shadow-amber-500/30'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              title={isAutoPlay ? 'Pause Auto Tour' : 'Start Auto Tour'}
            >
              {isAutoPlay ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden sm:inline">Tour Active</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden sm:inline">Auto Play</span>
                </>
              )}
            </button>
          </nav>

          {/* Right Spacer & Mobile Action */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="md:hidden">
              <button
                onClick={toggleAutoPlay}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer bg-black/60 backdrop-blur-xl border border-white/20 ${
                  isAutoPlay ? 'text-amber-400' : 'text-white'
                }`}
              >
                {isAutoPlay ? <Pause className="w-3.5 h-3.5 fill-amber-400" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              </button>
            </div>
            {/* Desktop balancing invisible block so center nav stays centered */}
            <div className="hidden lg:block w-[140px]" />
          </div>
        </div>
      </header>

      {/* ========================================================
          SECTION 1: HERO (ROTATING BOWL TURNTABLE)
          ======================================================== */}
      <section
        id="home"
        className="relative w-full min-h-screen overflow-hidden flex flex-col justify-start select-none isolate"
        style={{ background: currentFlavor.bgGradient }}
      >
        {/* Dynamic Background Gradient with Crossfade */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentFlavor.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: currentFlavor.bgGradient }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.40) 100%)',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Corner Ingredients Decor Overlay */}
        <div
          className="absolute top-0 left-0 right-0 w-full pointer-events-none z-10 overflow-hidden select-none will-change-transform"
          style={{ height: '48vh' }}
        >
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentFlavor.id}
              src={currentFlavor.decorImage}
              alt=""
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-0 w-full h-auto object-cover object-top pointer-events-none select-none max-h-[50vh]"
            />
          </AnimatePresence>
        </div>

        {/* Hero Text Content */}
        <div className="relative z-20 w-full max-w-3xl mx-auto px-6 pt-24 sm:pt-28 flex flex-col items-center justify-start text-center shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFlavor.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <h1
                className="text-6xl sm:text-7xl lg:text-8xl tracking-tight uppercase font-bold text-white drop-shadow-xl leading-none mb-3"
                style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
              >
                {currentFlavor.name}
              </h1>

              

              <div className="flex items-center gap-3 mt-1">
                <button
                  onClick={() => scrollToTarget('#flavors')}
                  className="text-white underline underline-offset-4 text-xs sm:text-sm font-medium hover:text-white/80 transition-colors drop-shadow-sm cursor-pointer"
                >
                  See our products
                </button>
                <button
                  onClick={() => scrollToTarget('#the-pour')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white text-white" />
                  <span>Watch Pour</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Lower Turntable Bowl & Curved Outer Ring */}
        <div
          className="circle-container absolute pointer-events-none z-10"
          style={{
            left: '50%',
            top: centerY,
            width: `${ringSize}px`,
            height: `${ringSize}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer Ring with Curved Flavor Names */}
          <div className="ring absolute inset-0 rounded-full border border-white/25 pointer-events-none">
            {FLAVORS.map((flavor, index) => {
              const isActive = index === currentIndex;
              const angle = startAngle + index * angleStep;

              const text = flavor.name.toUpperCase();
              const charAngleStep = isMobile ? 3.6 : 2.2;
              const totalAngle = (text.length - 1) * charAngleStep;
              const startTextAngle = -totalAngle / 2;

              return (
                <div
                  key={flavor.id}
                  onClick={() => goToFlavor(index)}
                  className={`flavor-item absolute cursor-pointer pointer-events-auto transition-opacity duration-300 ${
                    isActive
                      ? 'opacity-100 font-extrabold text-white scale-110 drop-shadow-md'
                      : 'opacity-40 hover:opacity-85 text-white/80'
                  }`}
                  style={{
                    top: '-42px',
                    left: '50%',
                    marginLeft: '-60px',
                    width: '120px',
                    transformOrigin: `50% ${ringSize / 2 + 42}px`,
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  {text.split('').map((char, charIdx) => {
                    const charAngle = startTextAngle + charIdx * charAngleStep;
                    return (
                      <span
                        key={charIdx}
                        className="absolute top-0 left-1/2 w-6 -ml-3 text-center text-xs tracking-widest font-bold"
                        style={{
                          fontFamily: "'Fredoka', cursive, sans-serif",
                          transformOrigin: `50% ${ringSize / 2 + 42}px`,
                          transform: `rotate(${charAngle}deg)`,
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Active Indicator Ring with Glowing Pip */}
          <motion.div
            className="indicator-ring absolute inset-0 rounded-full pointer-events-none"
            animate={{
              rotate: startAngle + currentIndex * angleStep,
            }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -top-2.5 left-1/2 -ml-2.5 w-5 h-5 rounded-full bg-white shadow-xl shadow-white/80 border-2 border-white/60 animate-ping" />
            <div className="absolute -top-2.5 left-1/2 -ml-2.5 w-5 h-5 rounded-full bg-white shadow-xl shadow-white/80 border-2 border-white/60" />
          </motion.div>

          {/* Big Rotating Bowl Center Container */}
          <div
            className="pie-container absolute rounded-full overflow-hidden shadow-2xl pointer-events-auto cursor-pointer"
            style={{
              top: `${ringGap}px`,
              left: `${ringGap}px`,
              width: `${pieSize}px`,
              height: `${pieSize}px`,
              boxShadow: '0 35px 90px rgba(0, 0, 0, 0.75), 0 0 50px rgba(255,255,255,0.12)',
            }}
            onClick={handleNext}
            title="Click bowl to rotate to next flavor"
          >
            <AnimatePresence custom={direction} initial={false}>
              <motion.img
                key={currentFlavor.id}
                custom={direction}
                variants={bowlVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                src={currentFlavor.image}
                alt={currentFlavor.name}
                loading="eager"
                decoding="sync"
                className="hero-pie absolute inset-0 w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.6)] gpu-layer"
                draggable={false}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Left & Right Turntable Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 z-30 pointer-events-none flex items-center justify-between px-6 sm:px-12">
          <button
            onClick={handlePrev}
            aria-label="Previous Flavor"
            className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-300 ease-out cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Flavor"
            className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-300 ease-out cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Subtle Bottom Scroll Hint */}
        <button
          onClick={() => scrollToTarget('#the-pour')}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <span>Scroll down</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </section>

      {/* ========================================================
          BELOW-THE-FOLD SECTIONS (LAZY LOADED VIA SUSPENSE)
          Loads independently so the Hero paints instantly without lag
          ======================================================== */}
      <Suspense fallback={<div className="w-full min-h-screen bg-[#140803]" />}>
        {/* SECTION 2: THE POUR (ONLY BELGIAN CHOCOLATE POURING) */}
        <section
          id="the-pour"
          ref={pourContainerRef}
          className="relative w-full min-h-screen h-screen overflow-hidden bg-[#140803] flex items-center justify-center section-render-opt"
        >
          <ChocolateScrollExperience
            isActive={isPourLocked}
            isAutoPlay={isAutoPlay}
            onComplete={handlePourComplete}
            onRewindToStart={handlePourRewind}
          />
        </section>

        {/* SECTIONS 3 & 4: FLAVORS SHOWCASE & CAMERRY HERITAGE STORY */}
        <AutoFlavorShowcase
          isActive={true}
          onGoToHeritage={() => scrollToTarget('#heritage')}
          onGoToFlavors={() => scrollToTarget('#flavors')}
          onGoToExperience={() => scrollToTarget('#experience')}
          onGoToAbout={() => scrollToTarget('#about')}
          onBackToTop={() => scrollToTarget('#home')}
        />

        {/* SECTION 5: EXPLODING ICE CREAM BAR COMMERCIAL */}
        <VideoScrollExperience
          onGoToAbout={() => scrollToTarget('#about')}
        />

        {/* SECTION 6: ABOUT ICE E & MINIMAL DARK FOOTER */}
        <AboutSection
          onBackToTop={() => scrollToTarget('#home')}
          onNavigateSection={(sec) => {
            if (sec === 0) scrollToTarget('#home');
            else if (sec === 1) scrollToTarget('#the-pour');
            else if (sec === 2) scrollToTarget('#flavors');
            else if (sec === 3) scrollToTarget('#heritage');
            else if (sec === 4) scrollToTarget('#experience');
            else scrollToTarget('#about');
          }}
        />
      </Suspense>
    </div>
  );
}

export default App;
