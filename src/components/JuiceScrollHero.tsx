import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
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
    animClass: string;
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
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-3-2.png',
        top: '16%',
        left: '78%',
        width: '14vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-3-3.png',
        top: '68%',
        left: '76%',
        width: '12vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/kiwi-decor.png',
        top: '0%',
        left: '4%',
        width: '24vw',
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
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-0-2.png',
        top: '15%',
        left: '77%',
        width: '14vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-0-3.png',
        top: '67%',
        left: '75%',
        width: '12vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/strawberry-decor.png',
        top: '0%',
        left: '70%',
        width: '26vw',
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
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/ref/ing-2-2.png',
        top: '18%',
        left: '76%',
        width: '13.5vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/ref/ing-2-3.png',
        top: '69%',
        left: '74%',
        width: '13vw',
        animClass: 'animate-float-medium',
      },
      {
        src: '/images/banana-decor.png',
        top: '0%',
        left: '2%',
        width: '25vw',
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
        animClass: 'animate-float-slow',
      },
      {
        src: '/images/choco-float-2.png',
        top: '15%',
        left: '78%',
        width: '13vw',
        animClass: 'animate-float-reverse',
      },
      {
        src: '/images/chocolate-decor.png',
        top: '0%',
        left: '68%',
        width: '27vw',
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

export function JuiceScrollHero({ isLocked = true, onUnlockAndNext }: JuiceScrollHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  const isAnimatingRef = useRef(false);

  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Exact Nicolai Palmkvist fullpage vertical slide + GSAP scale animation
  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex === activeIndexRef.current || isAnimatingRef.current) return;
    if (newIndex < 0 || newIndex >= SECTIONS.length) return;

    isAnimatingRef.current = true;
    const originIdx = activeIndexRef.current;
    const destinationIdx = newIndex;

    const originEl = sectionRefs.current[originIdx];
    const destinationEl = sectionRefs.current[destinationIdx];
    const toGradient = SECTIONS[destinationIdx].gradient;

    playScoopPop();

    // 1. Change background gradient smoothly (0.5s ease: none like template)
    if (bgLayerRef.current) {
      gsap.to(bgLayerRef.current, {
        backgroundImage: toGradient,
        duration: 0.5,
        ease: 'none',
      });
    }

    // 2. Shrink leaving section to scale: 0.5 (0.6s ease: power2.out like template)
    if (originEl) {
      gsap.to(originEl, {
        scale: 0.5,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    // 3. Translate container vertically with Fullpage.js style physics (0.85s ease: power2.inOut)
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        y: `-${destinationIdx * 100}vh`,
        duration: 0.85,
        ease: 'power2.inOut',
        onComplete: () => {
          setActiveIndex(destinationIdx);
          isAnimatingRef.current = false;
        },
      });
    }

    // 4. Grow entering section to scale: 1 (0.6s ease: power2.out like template)
    if (destinationEl) {
      gsap.fromTo(
        destinationEl,
        { scale: 0.5 },
        {
          scale: 1,
          duration: 0.7,
          delay: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  // Initial GSAP setup: Section 0 at scale 1; sections 1..3 at scale 0.5
  useEffect(() => {
    sectionRefs.current.forEach((el, idx) => {
      if (el) {
        if (idx === 0) {
          gsap.set(el, { scale: 1 });
        } else {
          gsap.set(el, { scale: 0.5 });
        }
      }
    });

    if (containerRef.current) {
      gsap.set(containerRef.current, { y: '0vh' });
    }

    if (bgLayerRef.current) {
      gsap.set(bgLayerRef.current, { backgroundImage: SECTIONS[0].gradient });
    }
  }, []);

  // Wheel and touch controller: One-by-one transitions, unlocks after 4th flavor
  useEffect(() => {
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return;

      e.preventDefault();
      e.stopPropagation();

      const now = performance.now();
      if (now - lastWheelTime < 600 || isAnimatingRef.current) return;

      const currentIdx = activeIndexRef.current;

      if (e.deltaY > 15) {
        // Scrolling DOWN
        if (currentIdx < SECTIONS.length - 1) {
          lastWheelTime = now;
          goToSlide(currentIdx + 1);
        } else {
          // 4th flavor reached! Next downward scroll unlocks into Section 2
          lastWheelTime = now;
          onUnlockAndNext?.();
        }
      } else if (e.deltaY < -15) {
        // Scrolling UP
        if (currentIdx > 0) {
          lastWheelTime = now;
          goToSlide(currentIdx - 1);
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLocked) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const now = performance.now();

      if (Math.abs(deltaY) > 30) {
        e.preventDefault();
        if (now - lastWheelTime < 600 || isAnimatingRef.current) return;

        const currentIdx = activeIndexRef.current;
        if (deltaY > 30) {
          if (currentIdx < SECTIONS.length - 1) {
            lastWheelTime = now;
            touchStartY = touchEndY;
            goToSlide(currentIdx + 1);
          } else {
            lastWheelTime = now;
            onUnlockAndNext?.();
          }
        } else if (deltaY < -30) {
          if (currentIdx > 0) {
            lastWheelTime = now;
            touchStartY = touchEndY;
            goToSlide(currentIdx - 1);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isLocked, goToSlide, onUnlockAndNext]);

  const currentSection = SECTIONS[activeIndex];

  return (
    <section
      id="home"
      ref={mainWrapperRef}
      className="relative w-full h-screen min-h-screen overflow-hidden select-none isolate flex items-center justify-center bg-[#0a0a0a]"
    >
      {/* ========================================================
          BACKGROUND GRADIENT LAYER & ELLIPTICAL SPOTLIGHT
          (Exact CSS from Nicolai Palmkvist's #main-wrapper::after)
          ======================================================== */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-500 ease-out"
        style={{
          backgroundImage: SECTIONS[0].gradient,
        }}
      />

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
          VERTICAL FULLPAGE CONTAINER (#img-container)
          Translates vertically by -100vh per section
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
                GIANT SPLIT TYPOGRAPHY (KI  WI / BE  RY / BA  NA / CH  OC)
                In 'Anton' juicy font, uppercase
                ==================================================== */}
            <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-16 lg:px-28 pointer-events-none z-10 select-none">
              <span
                className="text-[28vw] sm:text-[23vw] lg:text-[240px] font-normal uppercase leading-none text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  letterSpacing: '0.04em',
                }}
              >
                {sec.firstWord}
              </span>

              <span
                className="text-[28vw] sm:text-[23vw] lg:text-[240px] font-normal uppercase leading-none text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  letterSpacing: '0.04em',
                }}
              >
                {sec.secondWord}
              </span>
            </div>

            {/* ====================================================
                CENTER CIRCULAR BOWL PRODUCT IMAGE WITH CONTINUOUS SMOOTH 360° SPIN
                ==================================================== */}
            <div className="relative z-20 flex items-center justify-center pointer-events-auto">
              <div
                onClick={() => goToSlide((idx + 1) % SECTIONS.length)}
                className="group cursor-pointer will-change-transform transition-transform hover:scale-105 active:scale-95 duration-300"
                title="Click to switch flavor"
              >
                {/* Radial Glow Aura behind the bowl */}
                <div
                  className="absolute -inset-6 rounded-full blur-2xl opacity-40 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${sec.color} 0%, transparent 70%)`,
                  }}
                />

                <div className="w-[74vw] sm:w-[50vw] md:w-[42vw] lg:w-[38vw] max-w-[540px] aspect-square rounded-full overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.85)] filter select-none">
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

      {/* ========================================================
          BOTTOM STATUS BAR HUD
          ======================================================== */}
      <div className="absolute bottom-0 left-0 right-0 z-30 w-full pb-8 px-6 sm:px-12 flex items-end justify-between pointer-events-none">
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
      </div>
    </section>
  );
}

export default JuiceScrollHero;
