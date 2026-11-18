import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JuiceScrollHero } from './components/JuiceScrollHero';
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

  const [isHeroLocked, setIsHeroLocked] = useState(true);
  const isHeroLockedRef = useRef(true);
  isHeroLockedRef.current = isHeroLocked;

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

    // Lock page on hero initially
    lenis.stop(); // Initial hero lock

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
  
  const handleHeroUnlockAndNext = () => {
    setIsHeroLocked(false);
    isHeroLockedRef.current = false;
    if (lenisRef.current) {
      lenisRef.current.start();
    }
    scrollToTarget('#the-pour');
  };

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
            // Re-lock hero when user returns to top
            if (scrollY <= 15 && !isHeroLockedRef.current && !isNavigatingRef.current) {
              if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true });
                lenisRef.current.stop();
              }
              setIsHeroLocked(true);
              isHeroLockedRef.current = true;
              setActiveNav('HOME');
              return;
            }

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
          {/* Company Logo on the Left Side - Only the name without borders */}
          <div className="pointer-events-auto">
            <button
              onClick={() => {
                setActiveNav('HOME');
                playChime();
                scrollToTarget('#home');
              }}
              className="group flex items-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 py-1"
              title="ICE - E"
            >
              <span
                className="text-2xl sm:text-3xl font-black tracking-wider text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] group-hover:text-amber-300 transition-colors select-none"
                style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
              >
                ICE <span className="text-amber-400 font-black">•</span> E
              </span>
            </button>
          </div>

          {/* Navigation Links in Center */}
          <nav className="pointer-events-auto bg-black/60 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/20 hidden md:flex items-center gap-1 shadow-2xl">
            {[
              { name: 'HOME', target: '#home' },
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
          SECTION 1: HERO (NICOLAI PALMKVIST JUICE-PROJECT LIVE DEMO SCROLL)
          ======================================================== */}
      <JuiceScrollHero
        isLocked={isHeroLocked}
        onUnlockAndNext={handleHeroUnlockAndNext}
        onNavigateSection={(secId) => scrollToTarget(secId)}
      />

      {/* ========================================================
          BELOW-THE-FOLD SECTIONS (LAZY LOADED VIA SUSPENSE)
          Loads independently so the Hero paints instantly without lag
          ======================================================== */}
      <Suspense fallback={<div className="w-full min-h-screen bg-[#140803]" />}>
        

                {/* SECTION 2: THE POUR (ONLY BELGIAN CHOCOLATE POURING) */}
        <section
          id="the-pour"
          ref={pourContainerRef}
          className="relative w-full min-h-screen h-screen overflow-hidden bg-[#D2D7D4] flex items-center justify-center section-render-opt"
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
