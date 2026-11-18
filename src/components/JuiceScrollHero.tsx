import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { playScoopPop, playChime } from '../utils/audio';

export interface JuiceSection {
  id: string;
  firstWord: string;
  secondWord: string;
  fullName: string;
  number: string;
  color: string;
  gradient: string;
  circleBowlImage: string;
  ingredients: {
    src: string;
    top: string;
    left: string;
    width: string;
    yDelta: number;
    xDelta: number;
    rotDelta: number;
    initialRot: number;
    animClass?: string;
  }[];
}

const SECTIONS: JuiceSection[] = [
  {
    id: 'kiwi',
    firstWord: 'KI',
    secondWord: 'WI',
    fullName: 'Kiwi Garden Gelato',
    number: '01',
    color: '#31D677',
    gradient: 'radial-gradient(at center center, #31D677 30%, #259B57 72%)',
    circleBowlImage: '/images/kiwi-bowl-circle.png',
    ingredients: [
      {
        src: '/images/ref/ing-3-1.png',
        top: '18%',
        left: '12%',
        width: '13vw',
        yDelta: -160,
        xDelta: -40,
        rotDelta: 45,
        initialRot: -12,
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-3-2.png',
        top: '16%',
        left: '78%',
        width: '14vw',
        yDelta: -200,
        xDelta: 50,
        rotDelta: -60,
        initialRot: 18,
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-3-3.png',
        top: '68%',
        left: '76%',
        width: '12vw',
        yDelta: 180,
        xDelta: 60,
        rotDelta: 50,
        initialRot: -25,
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/kiwi-decor.png',
        top: '0%',
        left: '4%',
        width: '24vw',
        yDelta: -100,
        xDelta: -30,
        rotDelta: 20,
        initialRot: 0,
        animClass: 'animate-drift-slow',
      },
    ],
  },
  {
    id: 'strawberry',
    firstWord: 'BE',
    secondWord: 'RY',
    fullName: 'Ruby Strawberry Creme',
    number: '02',
    color: '#FF4F78',
    gradient: 'radial-gradient(at center center, #FF4F78 40%, #D92A54 72%)',
    circleBowlImage: '/images/strawberry-bowl-circle.png',
    ingredients: [
      {
        src: '/images/ref/ing-0-1.png',
        top: '19%',
        left: '11%',
        width: '13vw',
        yDelta: -170,
        xDelta: -50,
        rotDelta: 55,
        initialRot: 14,
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-0-2.png',
        top: '15%',
        left: '77%',
        width: '14vw',
        yDelta: -210,
        xDelta: 45,
        rotDelta: -50,
        initialRot: -16,
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-0-3.png',
        top: '67%',
        left: '75%',
        width: '12vw',
        yDelta: 190,
        xDelta: 55,
        rotDelta: 65,
        initialRot: 20,
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/strawberry-decor.png',
        top: '0%',
        left: '70%',
        width: '26vw',
        yDelta: -90,
        xDelta: 35,
        rotDelta: -25,
        initialRot: 5,
        animClass: 'animate-drift-slow',
      },
    ],
  },
  {
    id: 'banana',
    firstWord: 'BA',
    secondWord: 'NA',
    fullName: 'Banana Honey Blossom',
    number: '03',
    color: '#FFA94D',
    gradient: 'radial-gradient(at center center, #FFA94D 40%, #FF7E3D 72%)',
    circleBowlImage: '/images/banana-bowl-circle.png',
    ingredients: [
      {
        src: '/images/ref/ing-2-1.png',
        top: '17%',
        left: '13%',
        width: '14vw',
        yDelta: -160,
        xDelta: -40,
        rotDelta: 40,
        initialRot: -10,
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-2-2.png',
        top: '18%',
        left: '76%',
        width: '13.5vw',
        yDelta: -220,
        xDelta: 40,
        rotDelta: -45,
        initialRot: 22,
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-2-3.png',
        top: '69%',
        left: '74%',
        width: '13vw',
        yDelta: 170,
        xDelta: 50,
        rotDelta: 60,
        initialRot: -18,
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/banana-decor.png',
        top: '0%',
        left: '2%',
        width: '25vw',
        yDelta: -110,
        xDelta: -25,
        rotDelta: 15,
        initialRot: -5,
        animClass: 'animate-drift-slow',
      },
    ],
  },
  {
    id: 'chocolate',
    firstWord: 'CH',
    secondWord: 'OC',
    fullName: 'Belgian Cacao Velvet',
    number: '04',
    color: '#A259FF',
    gradient: 'radial-gradient(at center center, #A259FF 0%, #6A0DAD 72%)',
    circleBowlImage: '/images/chocolate-bowl-circle.png',
    ingredients: [
      {
        src: '/images/choco-float-1.png',
        top: '16%',
        left: '10%',
        width: '13vw',
        yDelta: -180,
        xDelta: -45,
        rotDelta: 60,
        initialRot: 15,
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/choco-float-2.png',
        top: '15%',
        left: '78%',
        width: '13vw',
        yDelta: -200,
        xDelta: 55,
        rotDelta: -55,
        initialRot: -20,
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/chocolate-decor.png',
        top: '0%',
        left: '68%',
        width: '27vw',
        yDelta: -90,
        xDelta: 30,
        rotDelta: -15,
        initialRot: 8,
        animClass: 'animate-drift-slow',
      },
    ],
  },
];

interface JuiceScrollHeroProps {
  onScrollToNext?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export function JuiceScrollHero({ onScrollToNext }: JuiceScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure continuous scroll progress through the 400vh pinned track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Buttery-smooth spring dampening for scroll scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.0003,
  });

  const [currentProgress, setCurrentProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const unsub = smoothProgress.on('change', (v) => {
      setCurrentProgress(v);
      const num = SECTIONS.length;
      const idx = Math.min(num - 1, Math.max(0, Math.floor(v * num)));
      if (idx !== activeIdx) {
        setActiveIdx(idx);
        playScoopPop();
      }
    });
    return () => unsub();
  }, [smoothProgress, activeIdx]);

  // Quick jump to a specific flavor section
  const jumpToFlavor = (index: number) => {
    if (!containerRef.current) return;
    const targetRatio = (index + 0.5) / SECTIONS.length;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = containerTop + targetRatio * containerHeight;

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScrollY, { duration: 1.2 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
    playScoopPop();
  };

  const currentSection = SECTIONS[activeIdx];

  return (
    <div
      ref={containerRef}
      id="home"
      className="relative w-full select-none"
      style={{ height: '400vh' }}
    >
      {/* ========================================================
          STICKY PINNED VIEWPORT CONTAINER
          ======================================================== */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between isolate bg-[#0a0a0a]">
        {/* ========================================================
            BACKGROUND GRADIENT CROSSFADE
            (Exact radial gradients from Nicolai Palmkvist's live demo)
            ======================================================== */}
        {SECTIONS.map((sec, idx) => {
          const num = SECTIONS.length;
          const start = idx / num;
          const range = 1 / num;
          const center = start + range / 2;
          const dist = Math.abs(currentProgress - center);
          // Smooth crossfade based on scroll proximity
          const opacity = Math.max(0, 1 - dist / (range * 0.75));

          return (
            <div
              key={`bg-${sec.id}`}
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out z-0"
              style={{
                backgroundImage: sec.gradient,
                opacity,
              }}
            />
          );
        })}

        {/* Nicolai's Exact Radial Elliptical Spotlight Pseudo-Overlay */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            top: '-50vh',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '100vw',
            background:
              'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.22) 10%, rgba(255, 255, 255, 0) 50%)',
          }}
        />

        {/* ========================================================
            LAYER 1: GIANT SPLIT TYPOGRAPHY (KI  WI / BE  RY / BA  NA / CH  OC)
            In 'Anton' juicy font, uppercase, tracking with scroll parallax
            ======================================================== */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-between px-6 sm:px-16 lg:px-28 overflow-hidden select-none">
          {SECTIONS.map((sec, idx) => {
            const num = SECTIONS.length;
            const start = idx / num;
            const center = start + 0.5 / num;
            const rel = (currentProgress - center) * num;
            const opacity = Math.max(0, 1 - Math.abs(rel) * 1.6);
            // Parallax expansion / sliding on scroll
            const leftWordX = rel * -45; // moves leftward as you scroll
            const rightWordX = rel * 45; // moves rightward as you scroll

            return (
              <div
                key={`words-${sec.id}`}
                className="absolute inset-0 flex items-center justify-between px-6 sm:px-16 lg:px-28 transition-opacity duration-150"
                style={{
                  opacity,
                  willChange: 'transform, opacity',
                }}
              >
                <span
                  className="text-[28vw] sm:text-[23vw] lg:text-[240px] font-normal uppercase leading-none text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] select-none"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: '0.04em',
                    transform: `translateX(${leftWordX}px)`,
                  }}
                >
                  {sec.firstWord}
                </span>

                <span
                  className="text-[28vw] sm:text-[23vw] lg:text-[240px] font-normal uppercase leading-none text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] select-none"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: '0.04em',
                    transform: `translateX(${rightWordX}px)`,
                  }}
                >
                  {sec.secondWord}
                </span>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            LAYER 2: FLOATING INGREDIENTS PARALLAX
            Fruit slices, berries & decor drifting with scroll scrub
            ======================================================== */}
        <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {SECTIONS.map((sec, idx) => {
            const num = SECTIONS.length;
            const start = idx / num;
            const center = start + 0.5 / num;
            const rel = (currentProgress - center) * num;
            const opacity = Math.max(0, 1 - Math.abs(rel) * 1.4);

            return (
              <div
                key={`ing-${sec.id}`}
                className="absolute inset-0 transition-opacity duration-200"
                style={{ opacity, pointerEvents: 'none' }}
              >
                {sec.ingredients.map((ing, ingIdx) => {
                  const y = rel * ing.yDelta;
                  const x = rel * ing.xDelta;
                  const rot = ing.initialRot + rel * ing.rotDelta;

                  return (
                    <img
                      key={ingIdx}
                      src={ing.src}
                      alt=""
                      loading="eager"
                      className={`absolute object-contain pointer-events-none select-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] ${ing.animClass || ''}`}
                      style={{
                        top: ing.top,
                        left: ing.left,
                        width: ing.width,
                        maxWidth: '220px',
                        minWidth: '70px',
                        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`,
                        willChange: 'transform',
                      }}
                      draggable={false}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ========================================================
            LAYER 3: CENTER HERO CIRCLE BOWL (-BOWL-CIRCLE IMAGES)
            Rotates continuously on its circular axis based on scroll!
            Scales in and out according to Nicolai's 0.5 -> 1.0 -> 0.5 curve
            ======================================================== */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          {SECTIONS.map((sec, idx) => {
            const num = SECTIONS.length;
            const start = idx / num;
            const center = start + 0.5 / num;
            const rel = (currentProgress - center) * num;

            // Opacity: peak at center, fade smoothly when scrolling away
            const opacity = Math.max(0, 1 - Math.abs(rel) * 1.6);

            // Scale: Nicolai's exact scale curve (1.0 in center, shrinking to 0.5 when exiting)
            const scale = Math.max(0.48, 1 - Math.abs(rel) * 0.52);

            // Scroll-driven circular rotation:
            // Continuous rotational spin directly proportional to scroll progress
            const rotationDeg = currentProgress * 360 + rel * 90;

            // Subtle vertical glide
            const yOffset = rel * -110;

            return (
              <div
                key={`circle-bowl-${sec.id}`}
                className="absolute flex items-center justify-center transition-opacity duration-150"
                style={{
                  opacity,
                  transform: `translate3d(0, ${yOffset}px, 0) scale(${scale})`,
                  willChange: 'transform, opacity',
                }}
              >
                <div
                  className="relative group cursor-pointer pointer-events-auto"
                  onClick={() => {
                    playScoopPop();
                    jumpToFlavor((idx + 1) % SECTIONS.length);
                  }}
                  title="Click to jump to next flavor"
                >
                  {/* Radial Spotlight Aura behind the bowl */}
                  <div
                    className="absolute -inset-8 rounded-full blur-2xl opacity-50 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${sec.color} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Circular Bowl Image (-bowl-circle.png) */}
                  <div
                    className="w-[72vw] sm:w-[50vw] md:w-[42vw] lg:w-[38vw] max-w-[540px] aspect-square rounded-full overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.8)] filter transition-all will-change-transform"
                    style={{
                      transform: `rotate(${rotationDeg}deg)`,
                    }}
                  >
                    <img
                      src={sec.circleBowlImage}
                      alt={sec.fullName}
                      loading="eager"
                      className="w-full h-full object-cover select-none drop-shadow-2xl pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Left & Right Jump Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 z-30 pointer-events-none flex items-center justify-between px-6 sm:px-12">
          <button
            onClick={() => {
              playScoopPop();
              jumpToFlavor((activeIdx - 1 + SECTIONS.length) % SECTIONS.length);
            }}
            aria-label="Previous Flavor"
            className="pointer-events-auto w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-300 ease-out cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              playScoopPop();
              jumpToFlavor((activeIdx + 1) % SECTIONS.length);
            }}
            aria-label="Next Flavor"
            className="pointer-events-auto w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-300 ease-out cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================
            TOP SPACER (Fixed Header sits in Global App Header)
            ======================================================== */}
        <div className="w-full pt-20 pointer-events-none" />

        {/* ========================================================
            BOTTOM STATUS BAR & SCROLL HUD
            ======================================================== */}
        <div className="relative z-30 w-full pb-8 px-6 sm:px-12 flex items-end justify-between pointer-events-none">
          {/* Left: Flavor Counter (01 / 04) & Current Title */}
          <div className="flex flex-col items-start gap-1">
            <span className="text-white/40 text-[10px] tracking-widest uppercase font-mono">
              FLAVOR SELECTION
            </span>
            <div className="flex items-baseline gap-1.5 text-white font-bold text-xl sm:text-2xl font-mono">
              <span>{currentSection.number}</span>
              <span className="text-white/30 text-sm font-normal">/</span>
              <span className="text-white/40 text-sm font-normal">04</span>
            </div>
            <span
              className="text-white/80 text-xs sm:text-sm font-semibold tracking-wide drop-shadow-sm mt-0.5"
              style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
            >
              {currentSection.fullName}
            </span>
          </div>

          {/* Center: Slide Switcher Dots */}
          <div className="pointer-events-auto flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-2xl">
            {SECTIONS.map((sec, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={sec.id}
                  onClick={() => jumpToFlavor(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-7 h-2 bg-white shadow-lg'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Jump to ${sec.fullName}`}
                  title={sec.fullName}
                />
              );
            })}
          </div>

          {/* Right: Scroll to Next Section */}
          <button
            onClick={() => {
              playChime();
              onScrollToNext?.();
            }}
            className="pointer-events-auto flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer text-xs uppercase tracking-wider group"
          >
            <span className="hidden sm:inline font-medium">Scroll down</span>
            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all group-hover:scale-105">
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JuiceScrollHero;
