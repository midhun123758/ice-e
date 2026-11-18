import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
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
        top: '15%',
        left: '12%',
        width: '12vw',
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-3-2.png',
        top: '14%',
        left: '74%',
        width: '13vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-3-3.png',
        top: '70%',
        left: '73%',
        width: '11vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/kiwi-decor.png',
        top: '2%',
        left: '4%',
        width: '22vw',
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
        top: '16%',
        left: '12%',
        width: '12vw',
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-0-2.png',
        top: '14%',
        left: '74%',
        width: '13vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-0-3.png',
        top: '68%',
        left: '72%',
        width: '11vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/strawberry-decor.png',
        top: '2%',
        left: '70%',
        width: '23vw',
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
        top: '15%',
        left: '13%',
        width: '13vw',
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-2-2.png',
        top: '16%',
        left: '73%',
        width: '12.5vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-2-3.png',
        top: '70%',
        left: '71%',
        width: '11.5vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/banana-decor.png',
        top: '2%',
        left: '3%',
        width: '23vw',
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
        src: '/images/choco-bite-1.png',
        top: '15%',
        left: '11%',
        width: '13vw',
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/choco-bite-2.png',
        top: '14%',
        left: '74%',
        width: '13vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/choco-bite-3.png',
        top: '69%',
        left: '72%',
        width: '11.5vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/choco-bite-4.png',
        top: '67%',
        left: '12%',
        width: '12vw',
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
}: JuiceScrollHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animation Lock Flag
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;

  /**
   * Transition to a slide using slow, cinematic, ultra-smooth GSAP mechanics
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
    const SLOW_SMOOTH_DURATION = 1.35; // Luxurious, slow, silky-smooth glide

    // 1. Morph background radial gradient with long, smooth blend
    if (bg) {
      gsap.to(bg, {
        backgroundImage: newGradient,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    }

    // 2. Scale down and soften origin section gently
    if (origin) {
      gsap.to(origin, {
        scale: 0.75,
        opacity: 0.35,
        duration: SLOW_SMOOTH_DURATION,
        ease: 'power3.inOut',
      });
    }

    // 3. Slide container vertically (-newIndex * 100vh) slowly and gracefully
    if (container) {
      gsap.to(container, {
        y: `${-newIndex * 100}vh`,
        duration: SLOW_SMOOTH_DURATION,
        ease: 'power3.inOut',
        onComplete: () => {
          setCurrentIndex(newIndex);
          isAnimatingRef.current = false;
        },
      });
    }

    // 4. Scale up destination section with a long, elegant glide into full view
    if (dest) {
      gsap.fromTo(
        dest,
        { scale: 0.75, opacity: 0.35 },
        {
          scale: 1,
          opacity: 1,
          duration: SLOW_SMOOTH_DURATION,
          ease: 'power3.inOut',
        }
      );
    }
  }, []);

  /**
   * Wheel Listener for exact slide-by-slide lock with smooth pacing
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
      }, 220);

      const THRESHOLD = 60;

      if (wheelAccum > THRESHOLD) {
        wheelAccum = 0;
        const cur = currentIndexRef.current;
        if (cur < SECTIONS.length - 1) {
          goToSlide(cur + 1);
        } else {
          // After 4th flavor: advance to Section 2 (#the-pour)
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
                LEFT COLUMN: LARGER EDITORIAL HEADLINE & STORY
                ==================================================== */}
            <div className="absolute left-6 sm:left-12 lg:left-16 xl:left-24 top-1/2 -translate-y-1/2 z-30 max-w-[280px] sm:max-w-[340px] lg:max-w-[400px] xl:max-w-[440px] flex flex-col items-start pointer-events-auto select-text">
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[5.5rem] font-bold text-white uppercase tracking-tight leading-[0.92] mb-5 drop-shadow-[0_6px_20px_rgba(0,0,0,0.4)] select-none"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {sec.heroTitle}
              </h1>
              <p className="text-white/95 text-sm sm:text-base lg:text-lg xl:text-[1.15rem] leading-relaxed font-normal drop-shadow-md">
                {sec.description}
              </p>
            </div>

            {/* ====================================================
                CENTER: EXTRA LARGE CONDENSED ANTON LETTERS
                Larger font hugging the expanded circular bowl
                ==================================================== */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none overflow-hidden">
              <div className="relative flex items-center justify-center">
                {/* Left Word Segment */}
                <span
                  className="text-[30vw] sm:text-[26vw] md:text-[23vw] lg:text-[240px] xl:text-[290px] 2xl:text-[330px] font-normal uppercase leading-none text-white drop-shadow-[0_25px_50px_rgba(0,0,0,0.45)] -mr-8 sm:-mr-12 lg:-mr-16 xl:-mr-20"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: '0.01em',
                  }}
                >
                  {sec.firstWord}
                </span>

                {/* Center Spacer: sized to match the expanded bowl */}
                <div className="w-[50vw] sm:w-[42vw] md:w-[38vw] lg:w-[34vw] xl:w-[32vw] max-w-[470px] aspect-square shrink-0 pointer-events-none" />

                {/* Right Word Segment */}
                <span
                  className="text-[30vw] sm:text-[26vw] md:text-[23vw] lg:text-[240px] xl:text-[290px] 2xl:text-[330px] font-normal uppercase leading-none text-white drop-shadow-[0_25px_50px_rgba(0,0,0,0.45)] -ml-8 sm:-ml-12 lg:-ml-16 xl:-ml-20"
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
                CENTER: EXPANDED CONTINUOUSLY ROTATING CIRCULAR BOWL
                Increased size for bold presence + 360° smooth spin
                ==================================================== */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div
                onClick={() => goToSlide((idx + 1) % SECTIONS.length)}
                className="group cursor-pointer pointer-events-auto will-change-transform transition-transform hover:scale-105 active:scale-95 duration-300"
                title="Click to explore next flavor"
              >
                {/* Enhanced Radial Glow behind circular bowl */}
                <div
                  className="absolute -inset-8 rounded-full blur-3xl opacity-50 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${sec.color} 0%, transparent 70%)`,
                  }}
                />

                <div className="w-[52vw] sm:w-[44vw] md:w-[40vw] lg:w-[36vw] xl:w-[34vw] max-w-[490px] aspect-square rounded-full overflow-hidden shadow-[0_40px_90px_rgba(0,0,0,0.85)] filter select-none">
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
                ==================================================== */}
            <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-25 flex items-center gap-3 pointer-events-none opacity-85 select-none">
              <div className="w-12 sm:w-20 h-[1px] bg-white/40" />
              <span className="text-white text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase font-mono drop-shadow-sm">
                choose your scoop
              </span>
              <div className="w-12 sm:w-20 h-[1px] bg-white/40" />
            </div>

            {/* ====================================================
                FLOATING INGREDIENTS AROUND PRODUCT
                Uses clean, transparent chocolate bites for chocolate
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
                    maxWidth: '220px',
                    minWidth: '70px',
                  }}
                  draggable={false}
                />
              ))}
            </div>


          </div>
        ))}
      </div>
    </section>
  );
}

export default JuiceScrollHero;
