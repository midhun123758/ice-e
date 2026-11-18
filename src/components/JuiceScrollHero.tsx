import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
// lucide icons removed for clean minimal design
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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bowlRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Function to perform the exact Nicolai Palmkvist GSAP animation
  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex === activeIndexRef.current || isAnimatingRef.current) return;
    if (newIndex < 0 || newIndex >= SECTIONS.length) return;

    isAnimatingRef.current = true;
    const originIdx = activeIndexRef.current;
    const destinationIdx = newIndex;

    const originEl = sectionRefs.current[originIdx];
    const destinationEl = sectionRefs.current[destinationIdx];
    const destinationBowl = bowlRefs.current[destinationIdx];
    const toGradient = SECTIONS[destinationIdx].gradient;

    playScoopPop();

    // 1. Change background gradient smoothly
    if (bgLayerRef.current) {
      gsap.to(bgLayerRef.current, {
        backgroundImage: toGradient,
        duration: 0.5,
        ease: 'none',
      });
    }

    // 2. Shrink leaving section (Nicolai's exact scale: 0.5, duration: 0.6s)
    if (originEl) {
      gsap.to(originEl, {
        scale: 0.5,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(originEl, { display: 'none' });
        },
      });
    }

    // 3. Grow entering section (Nicolai's exact scale: 0.5 -> 1.0, duration: 0.6s)
    if (destinationEl) {
      gsap.set(destinationEl, { display: 'flex', scale: 0.5, opacity: 0 });
      gsap.to(destinationEl, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          setActiveIndex(destinationIdx);
          isAnimatingRef.current = false;
        },
      });

      // Subtle rotation spin on entering circular bowl
      if (destinationBowl) {
        gsap.fromTo(
          destinationBowl,
          { rotate: -35 },
          { rotate: 0, duration: 0.75, ease: 'power2.out' }
        );
      }
    } else {
      setActiveIndex(destinationIdx);
      isAnimatingRef.current = false;
    }
  }, []);

  // Initial GSAP setup
  useEffect(() => {
    // Set first slide active and all other slides hidden at scale: 0.5
    sectionRefs.current.forEach((el, idx) => {
      if (el) {
        if (idx === 0) {
          gsap.set(el, { scale: 1, opacity: 1, display: 'flex' });
        } else {
          gsap.set(el, { scale: 0.5, opacity: 0, display: 'none' });
        }
      }
    });

    if (bgLayerRef.current) {
      gsap.set(bgLayerRef.current, { backgroundImage: SECTIONS[0].gradient });
    }
  }, []);

  // Wheel and touch controller: Advances flavors 1 by 1 while locked; unlocks after 4th flavor
  useEffect(() => {
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      // Only process when hero is locked at the top of the page
      if (!isLocked) return;

      e.preventDefault();
      e.stopPropagation();

      const now = performance.now();
      if (now - lastWheelTime < 550 || isAnimatingRef.current) return;

      const currentIdx = activeIndexRef.current;

      if (e.deltaY > 15) {
        // Scrolling DOWN
        if (currentIdx < SECTIONS.length - 1) {
          // Advance flavor 1 by 1: 0 -> 1 -> 2 -> 3
          lastWheelTime = now;
          goToSlide(currentIdx + 1);
        } else {
          // On the 4th flavor! Downward scroll now unlocks and glides into Section 2
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
        if (now - lastWheelTime < 550 || isAnimatingRef.current) return;

        const currentIdx = activeIndexRef.current;
        if (deltaY > 30) {
          // Swipe UP (Scroll DOWN)
          if (currentIdx < SECTIONS.length - 1) {
            lastWheelTime = now;
            touchStartY = touchEndY;
            goToSlide(currentIdx + 1);
          } else {
            lastWheelTime = now;
            onUnlockAndNext?.();
          }
        } else if (deltaY < -30) {
          // Swipe DOWN (Scroll UP)
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
          SECTIONS CONTAINER (#img-container)
          ======================================================== */}
      <div
        id="img-container"
        className="relative w-full h-full flex items-center justify-center z-10 overflow-hidden"
      >
        {SECTIONS.map((sec, idx) => (
          <div
            key={sec.id}
            ref={(el) => (sectionRefs.current[idx] = el)}
            className="section absolute inset-0 w-full h-full flex items-center justify-center will-change-transform"
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
                CENTER CIRCULAR BOWL PRODUCT IMAGE (-BOWL-CIRCLE.PNG)
                ==================================================== */}
            <div className="relative z-20 flex items-center justify-center pointer-events-auto">
              <div
                ref={(el) => (bowlRefs.current[idx] = el)}
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
                    className="w-full h-full object-cover select-none drop-shadow-2xl pointer-events-none"
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

      
    </section>
  );
}

export default JuiceScrollHero;
