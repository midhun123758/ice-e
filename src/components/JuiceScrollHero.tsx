import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Instagram, Facebook, Globe, Share2, ArrowRight } from 'lucide-react';
import { playScoopPop, playChime } from '../utils/audio';

export interface JuiceSection {
  id: string;
  firstWord: string;
  secondWord: string;
  heroTitle: string;
  flavorLabel: string;
  fullName: string;
  number: string;
  color: string;
  gradient: string;
  circleBowlImage: string;
  description: string;
  ingredients: {
    src: string;
    top: string;
    left: string;
    width: string;
    animClass: string;
  }[];
}

const SECTIONS: JuiceSection[] = [
  {
    id: 'kiwi',
    firstWord: 'KI',
    secondWord: 'WI',
    heroTitle: 'Pure Taste',
    flavorLabel: 'Kiwi Garden Flavor',
    fullName: 'Kiwi Garden Gelato',
    number: '01',
    color: '#31D677',
    gradient: 'radial-gradient(at center center, #31D677 30%, #259B57 72%)',
    circleBowlImage: '/images/kiwi-bowl-circle.png',
    description:
      'Crafted from nature’s best, every scoop is a blend of pure hand-sliced kiwi wheels, sweet white grapes, and double-churned custard.',
    ingredients: [
      {
        src: '/images/ref/ing-3-1.png',
        top: '18%',
        left: '14%',
        width: '11vw',
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-3-2.png',
        top: '16%',
        left: '74%',
        width: '12vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-3-3.png',
        top: '68%',
        left: '72%',
        width: '10vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/kiwi-decor.png',
        top: '2%',
        left: '5%',
        width: '20vw',
        animClass: 'animate-drift-slow',
      },
    ],
  },
  {
    id: 'strawberry',
    firstWord: 'BER',
    secondWord: 'RY',
    heroTitle: 'Pure Taste',
    flavorLabel: 'Ruby Strawberry Creme',
    fullName: 'Ruby Strawberry Creme',
    number: '02',
    color: '#FF4F78',
    gradient: 'radial-gradient(at center center, #FF4F78 40%, #D92A54 72%)',
    circleBowlImage: '/images/strawberry-bowl-circle.png',
    description:
      'Handpicked alpine strawberries blended into a luscious velvety cream base, topped with delicate white chocolate shards and fresh berry nectar.',
    ingredients: [
      {
        src: '/images/ref/ing-0-1.png',
        top: '19%',
        left: '13%',
        width: '11vw',
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-0-2.png',
        top: '15%',
        left: '73%',
        width: '12vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-0-3.png',
        top: '67%',
        left: '71%',
        width: '10vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/strawberry-decor.png',
        top: '2%',
        left: '70%',
        width: '22vw',
        animClass: 'animate-drift-slow',
      },
    ],
  },
  {
    id: 'banana',
    firstWord: 'BAN',
    secondWord: 'ANA',
    heroTitle: 'Pure Taste',
    flavorLabel: 'Banana Honey Blossom',
    fullName: 'Banana Honey Blossom',
    number: '03',
    color: '#FFA94D',
    gradient: 'radial-gradient(at center center, #FFA94D 40%, #FF7E3D 72%)',
    circleBowlImage: '/images/banana-bowl-circle.png',
    description:
      'Sun-ripened banana slices folded into wildflower honey custard, topped with clouds of toasted marshmallow meringue and crispy golden honeycomb.',
    ingredients: [
      {
        src: '/images/ref/ing-2-1.png',
        top: '17%',
        left: '15%',
        width: '12vw',
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-2-2.png',
        top: '18%',
        left: '72%',
        width: '11.5vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-2-3.png',
        top: '69%',
        left: '70%',
        width: '11vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/banana-decor.png',
        top: '2%',
        left: '4%',
        width: '22vw',
        animClass: 'animate-drift-slow',
      },
    ],
  },
  {
    id: 'chocolate',
    firstWord: 'CHO',
    secondWord: 'CO',
    heroTitle: 'Pure Taste',
    flavorLabel: 'Belgian Dark Cocoa',
    fullName: 'Belgian Dark Chocolate',
    number: '04',
    color: '#7B3F00',
    gradient: 'radial-gradient(at center center, #7B3F00 35%, #421D05 75%)',
    circleBowlImage: '/images/chocolate-bowl-circle.png',
    description:
      'Velvety double-churned Belgian 72% dark chocolate gelato loaded with crunchy chocolate pearls and molten hot fudge drizzle.',
    ingredients: [
      {
        src: '/images/ref/ing-1-1.png',
        top: '19%',
        left: '14%',
        width: '11.5vw',
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-1-2.png',
        top: '16%',
        left: '73%',
        width: '12vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-1-3.png',
        top: '68%',
        left: '71%',
        width: '10.5vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/chocolate-decor.png',
        top: '2%',
        left: '68%',
        width: '22vw',
        animClass: 'animate-drift-slow',
      },
    ],
  },
];

interface JuiceScrollHeroProps {
  isLocked?: boolean;
  onUnlockAndNext?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export function JuiceScrollHero({
  isLocked = true,
  onUnlockAndNext,
  onNavigateSection,
}: JuiceScrollHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({
    0: 'Single',
    1: 'Single',
    2: 'Single',
    3: 'Single',
  });

  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animation Lock Flag
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;

  const currentSection = SECTIONS[currentIndex];

  /**
   * Transition to a slide using Nicolai Palmkvist's exact GSAP mechanics
   */
  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= SECTIONS.length) return;
    if (newIndex === currentIndexRef.current || isAnimatingRef.current) return;

    const oldIndex = currentIndexRef.current;
    isAnimatingRef.current = true;

    playScoopPop();

    const origin = sectionRefs.current[oldIndex];
    const dest = sectionRefs.current[newIndex];
    const container = containerRef.current;
    const bg = bgRef.current;

    const newGradient = SECTIONS[newIndex].gradient;

    // 1. Morph background radial gradient
    if (bg) {
      gsap.to(bg, {
        backgroundImage: newGradient,
        duration: 0.65,
        ease: 'power2.out',
      });
    }

    // 2. Scale down origin section
    if (origin) {
      gsap.to(origin, {
        scale: 0.55,
        duration: 0.6,
        ease: 'power2.inOut',
      });
    }

    // 3. Slide container vertically (-newIndex * 100vh)
    if (container) {
      gsap.to(container, {
        y: `${-newIndex * 100}vh`,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentIndex(newIndex);
          isAnimatingRef.current = false;
        },
      });
    }

    // 4. Scale up destination section
    if (dest) {
      gsap.fromTo(
        dest,
        { scale: 0.55 },
        {
          scale: 1,
          duration: 0.7,
          ease: 'power2.inOut',
        }
      );
    }
  }, []);

  /**
   * Wheel Listener for exact slide-by-slide lock
   */
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    let wheelAccum = 0;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return;

      e.preventDefault();
      e.stopPropagation();

      if (isAnimatingRef.current) return;

      wheelAccum += e.deltaY;

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        wheelAccum = 0;
      }, 180);

      const THRESHOLD = 55;

      if (wheelAccum > THRESHOLD) {
        wheelAccum = 0;
        const cur = currentIndexRef.current;
        if (cur < SECTIONS.length - 1) {
          goToSlide(cur + 1);
        } else {
          // After 4th flavor: advance to Section 2
          if (onUnlockAndNext) {
            playChime();
            onUnlockAndNext();
          }
        }
      } else if (wheelAccum < -THRESHOLD) {
        wheelAccum = 0;
        const cur = currentIndexRef.current;
        if (cur > 0) {
          goToSlide(cur - 1);
        }
      }
    };

    // Keyboard arrow / Page navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked || isAnimatingRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        const cur = currentIndexRef.current;
        if (cur < SECTIONS.length - 1) {
          goToSlide(cur + 1);
        } else if (onUnlockAndNext) {
          onUnlockAndNext();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const cur = currentIndexRef.current;
        if (cur > 0) {
          goToSlide(cur - 1);
        }
      }
    };

    // Touch Swipe Navigation for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isLocked || isAnimatingRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 40) {
        if (deltaY > 0) {
          const cur = currentIndexRef.current;
          if (cur < SECTIONS.length - 1) {
            goToSlide(cur + 1);
          } else if (onUnlockAndNext) {
            onUnlockAndNext();
          }
        } else {
          const cur = currentIndexRef.current;
          if (cur > 0) {
            goToSlide(cur - 1);
          }
        }
      }
    };

    heroEl.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    heroEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    heroEl.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      heroEl.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      heroEl.removeEventListener('touchstart', handleTouchStart);
      heroEl.removeEventListener('touchend', handleTouchEnd);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [isLocked, goToSlide, onUnlockAndNext]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative w-full h-screen overflow-hidden select-none bg-[#259B57]"
      style={{
        touchAction: isLocked ? 'none' : 'auto',
      }}
    >
      {/* ========================================================
          BACKGROUND GRADIENT CANVAS
          ======================================================== */}
      <div
        ref={bgRef}
        id="bg"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-300"
        style={{
          backgroundImage: SECTIONS[0].gradient,
        }}
      />

      {/* Atmospheric Radial Vignette */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-1 rounded-full opacity-60"
        style={{
          width: '100vw',
          height: '100vw',
          background:
            'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.15) 15%, rgba(255, 255, 255, 0) 55%)',
        }}
      />

      {/* ========================================================
          VERTICAL FULLPAGE CONTAINER (#img-container)
          ======================================================== */}
      <div
        ref={containerRef}
        id="img-container"
        className="absolute top-0 left-0 w-full flex flex-col z-10 will-change-transform"
        style={{
          height: `${SECTIONS.length * 100}vh`,
        }}
      >
        {SECTIONS.map((sec, idx) => (
          <div
            key={sec.id}
            ref={(el) => (sectionRefs.current[idx] = el)}
            className="section relative w-full h-screen flex items-center justify-center will-change-transform select-none"
            style={{
              transformOrigin: 'center center',
            }}
          >
            {/* ====================================================
                LEFT COLUMN: EDITORIAL HEADLINE & STORY PARAGRAPH
                Matches the "Pure Taste" editorial column from reference
                ==================================================== */}
            <div className="absolute left-6 sm:left-10 lg:left-16 xl:left-24 top-1/2 -translate-y-1/2 z-30 max-w-[260px] sm:max-w-[310px] lg:max-w-[340px] flex flex-col items-start pointer-events-auto select-text">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-bold text-white uppercase tracking-tight leading-[0.95] mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] select-none"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {sec.heroTitle}
              </h1>
              <p className="text-white/90 text-xs sm:text-sm lg:text-[0.95rem] leading-relaxed font-normal mb-2 drop-shadow-sm">
                {sec.description}
              </p>
            </div>

            {/* ====================================================
                BOTTOM-LEFT: SOCIAL MEDIA ICONS
                Matches reference horizontal footer social links
                ==================================================== */}
            <div className="absolute bottom-7 left-6 sm:left-10 lg:left-16 xl:left-24 z-30 flex items-center gap-4 text-white/80 pointer-events-auto">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white hover:scale-110 transition-all p-1"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white hover:scale-110 transition-all p-1"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#website"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection?.('#about');
                }}
                className="hover:text-white hover:scale-110 transition-all p-1"
                title="Ice-E Official"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#share"
                onClick={(e) => {
                  e.preventDefault();
                  if (navigator.share) {
                    navigator.share({ title: 'ICE-E Gelato', url: window.location.href });
                  }
                }}
                className="hover:text-white hover:scale-110 transition-all p-1"
                title="Share Flavor"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>

            {/* ====================================================
                CENTER: GIANT CONDENSED LETTERS CLOSELY FRAMING BOWL
                "KI" [Bowl] "WI"
                "BER" [Bowl] "RY"
                "BAN" [Bowl] "ANA"
                "CHO" [Bowl] "CO"
                ==================================================== */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none overflow-hidden">
              <div className="relative flex items-center justify-center">
                {/* Left Word Segment */}
                <span
                  className="text-[26vw] sm:text-[22vw] lg:text-[200px] xl:text-[240px] font-normal uppercase leading-none text-white drop-shadow-[0_20px_45px_rgba(0,0,0,0.38)] -mr-6 sm:-mr-10 lg:-mr-14"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: '0.01em',
                  }}
                >
                  {sec.firstWord}
                </span>

                {/* Center Spacer exact match to bowl diameter */}
                <div className="w-[44vw] sm:w-[36vw] md:w-[32vw] lg:w-[28vw] max-w-[380px] aspect-square shrink-0 pointer-events-none" />

                {/* Right Word Segment */}
                <span
                  className="text-[26vw] sm:text-[22vw] lg:text-[200px] xl:text-[240px] font-normal uppercase leading-none text-white drop-shadow-[0_20px_45px_rgba(0,0,0,0.38)] -ml-6 sm:-ml-10 lg:-ml-14"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: '0.01em',
                  }}
                >
                  {sec.secondWord}
                </span>
              </div>
            </div>

            {/* ====================================================
                CENTER: CONTINUOUSLY ROTATING CIRCULAR BOWL (360° SPIN)
                Smoothly spins on center axis, with hover & click to next
                ==================================================== */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div
                onClick={() => goToSlide((idx + 1) % SECTIONS.length)}
                className="group cursor-pointer pointer-events-auto will-change-transform transition-transform hover:scale-105 active:scale-95 duration-300"
                title="Click to explore next flavor"
              >
                {/* Subtle Glow Aura behind circular bowl */}
                <div
                  className="absolute -inset-6 rounded-full blur-2xl opacity-40 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${sec.color} 0%, transparent 70%)`,
                  }}
                />

                <div className="w-[46vw] sm:w-[38vw] md:w-[34vw] lg:w-[30vw] max-w-[400px] aspect-square rounded-full overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.85)] filter select-none">
                  <img
                    src={sec.circleBowlImage}
                    alt={sec.fullName}
                    loading="eager"
                    className="w-full h-full object-cover select-none drop-shadow-2xl pointer-events-none animate-spin-smooth"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* ====================================================
                CENTER BOTTOM: "CHOOSE YOUR SCOOP" HAIRLINE LINE
                Matches reference "choose your size" under product
                ==================================================== */}
            <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-25 flex items-center gap-3 pointer-events-none opacity-85 select-none">
              <div className="w-10 sm:w-16 h-[1px] bg-white/40" />
              <span
                className="text-white text-[10px] sm:text-xs font-semibold tracking-widest uppercase font-mono drop-shadow-sm"
              >
                choose your scoop
              </span>
              <div className="w-10 sm:w-16 h-[1px] bg-white/40" />
            </div>

            {/* ====================================================
                FLOATING INGREDIENTS AROUND PRODUCT
                ==================================================== */}
            <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
              {sec.ingredients.map((ing, ingIdx) => (
                <img
                  key={ingIdx}
                  src={ing.src}
                  alt=""
                  loading="eager"
                  className={`absolute object-contain pointer-events-none select-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] ${ing.animClass}`}
                  style={{
                    top: ing.top,
                    left: ing.left,
                    width: ing.width,
                    maxWidth: '190px',
                    minWidth: '60px',
                  }}
                  draggable={false}
                />
              ))}
            </div>

            {/* ====================================================
                RIGHT SIDE: FLAVOR LABEL & PORTION PILL SELECTORS
                Matches "Cucumber Flavor" + "[ 500 ml ] [ 300 ml ] [ 100 ml ]"
                ==================================================== */}
            <div className="absolute right-6 sm:right-10 lg:right-16 xl:right-24 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end pointer-events-auto select-none">
              <span className="text-white/95 text-xs sm:text-sm lg:text-base font-semibold tracking-wide mb-3 drop-shadow-sm">
                {sec.flavorLabel}
              </span>

              <div className="flex items-center gap-2">
                {['Single', 'Double', 'Pint'].map((size) => {
                  const isSelected = selectedSizes[idx] === size;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        playScoopPop();
                        setSelectedSizes((prev) => ({ ...prev, [idx]: size }));
                      }}
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-stone-900 shadow-xl scale-105'
                          : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/25'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ====================================================
                BOTTOM-RIGHT: CTA BUTTON
                Matches reference "Import template >" bottom right pill
                ==================================================== */}
            <div className="absolute bottom-6 sm:bottom-7 right-6 sm:right-10 lg:right-16 xl:right-24 z-30 pointer-events-auto">
              <button
                onClick={() => {
                  playChime();
                  onNavigateSection?.('#flavors');
                }}
                className="group flex items-center gap-2 bg-white text-stone-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-2xl hover:bg-amber-300 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Explore Flavors</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default JuiceScrollHero;
