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
  const bgRefA = useRef<HTMLDivElement>(null);
  const bgRefB = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bowlRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    const bgA = bgRefA.current;
    const bgB = bgRefB.current;

    const newGradient = SECTIONS[newIndex].gradient;
    const SLOW_SMOOTH_DURATION = 1.15; // Silky-smooth, calm, elegant glide

    // 1. Dual-layer pure opacity crossfade for radial background (zero browser repaint stutter)
    if (bgA && bgB) {
      bgB.style.backgroundImage = newGradient;
      gsap.fromTo(
        bgB,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.05,
          ease: 'power2.inOut',
          onComplete: () => {
            if (bgA && bgB) {
              bgA.style.backgroundImage = newGradient;
              bgB.style.opacity = '0';
            }
          },
        }
      );
    }

    // 2. Scale down and soften origin section gently
    if (origin) {
      gsap.to(origin, {
        scale: 0.8,
        opacity: 0.3,
        duration: SLOW_SMOOTH_DURATION,
        ease: 'power2.inOut',
      });
    }

    // 3. Slide container vertically (-newIndex * 100vh) slowly and gracefully
    if (container) {
      gsap.to(container, {
        y: `${-newIndex * 100}vh`,
        duration: SLOW_SMOOTH_DURATION,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentIndex(newIndex);
          isAnimatingRef.current = false;
        },
      });
    }

    // 4. Scale up destination section with an elegant glide into full view
    if (dest) {
      gsap.fromTo(
        dest,
        { scale: 0.8, opacity: 0.3 },
        {
          scale: 1,
          opacity: 1,
          duration: SLOW_SMOOTH_DURATION,
          ease: 'power2.inOut',
        }
      );
    }
  }, []);

  /**
   * Drop the 4th flavor downwards into the second section (#the-pour)
   */
  const dropToNextSection = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    playScoopPop();

    const activeBowl = bowlRefs.current[3];
    const activeSection = sectionRefs.current[3];

    // GSAP Timeline for the gravity drop into Section 2
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // 1. The chocolate bowl drops down through the bottom of the section with gravity
    if (activeBowl) {
      tl.to(
        activeBowl,
        {
          y: '115vh',
          rotation: 14,
          scale: 0.88,
          duration: 1.1,
          ease: 'power2.in',
        },
        0
      );
    }

    // 2. Parallax: text and decorative ingredients disperse smoothly as the flavor plunges down
    if (activeSection) {
      const texts = activeSection.querySelectorAll('.select-text, h1, p');
      const ings = activeSection.querySelectorAll(
        '.animate-float-slow, .animate-float-reverse, .animate-float-medium, .animate-drift-slow'
      );
      tl.to(
        texts,
        {
          y: -60,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
        },
        0.05
      );
      tl.to(
        ings,
        {
          y: '75vh',
          opacity: 0,
          duration: 0.95,
          ease: 'power2.in',
        },
        0.1
      );
    }

    // 3. Initiate page scroll to Section 2 (#the-pour) right as the drop plunges down
    setTimeout(() => {
      if (onUnlockAndNext) {
        playChime();
        onUnlockAndNext();
      }
    }, 120);

    // 4. Restore original layout state after scroll has safely transitioned to Section 2
    setTimeout(() => {
      if (activeBowl) {
        gsap.set(activeBowl, { y: 0, rotation: 0, scale: 1 });
      }
      if (activeSection) {
        const elements = activeSection.querySelectorAll(
          '.select-text, h1, p, .animate-float-slow, .animate-float-reverse, .animate-float-medium, .animate-drift-slow'
        );
        gsap.set(elements, { y: 0, opacity: 1 });
      }
    }, 2200);
  }, [onUnlockAndNext]);

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
      if (window.scrollY > 20) return;

      e.preventDefault();
      e.stopPropagation();

      if (isAnimatingRef.current) return;

      wheelAccum += e.deltaY;

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        wheelAccum = 0;
      }, 200);

      const THRESHOLD = 50;

      if (wheelAccum > THRESHOLD) {
        wheelAccum = 0;
        const cur = currentIndexRef.current;
        if (cur < SECTIONS.length - 1) {
          goToSlide(cur + 1);
        } else {
          // After 4th flavor: drop the flavor down into Section 2
          dropToNextSection();
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
      if (window.scrollY > 20) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        const cur = currentIndexRef.current;
        if (cur < SECTIONS.length - 1) {
          goToSlide(cur + 1);
        } else {
          dropToNextSection();
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
      if (window.scrollY > 20) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 35) {
        if (deltaY > 0) {
          const cur = currentIndexRef.current;
          if (cur < SECTIONS.length - 1) {
            goToSlide(cur + 1);
          } else {
            dropToNextSection();
          }
        } else {
          const cur = currentIndexRef.current;
          if (cur > 0) {
            goToSlide(cur - 1);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
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
          BACKGROUND GRADIENT CANVAS (DUAL-LAYER OPACITY CROSSFADE)
          ======================================================== */}
      <div
        ref={bgRefA}
        id="bg-a"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{
          backgroundImage: SECTIONS[0].gradient,
        }}
      />
      <div
        ref={bgRefB}
        id="bg-b"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-0 will-change-[opacity]"
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
                LEFT COLUMN: BALANCED EDITORIAL HEADLINE & STORY
                Clean Suja-style hierarchy, perfectly spaced from center
                ==================================================== */}
            <div className="absolute left-6 sm:left-10 lg:left-12 xl:left-16 top-1/2 -translate-y-1/2 z-30 max-w-[240px] sm:max-w-[270px] lg:max-w-[300px] flex flex-col items-start pointer-events-auto select-text">
              <h1
                className="text-3xl sm:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] font-normal text-white uppercase leading-[0.98] mb-3 sm:mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] select-none"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  letterSpacing: '0.06em',
                  wordSpacing: '0.15em',
                }}
              >
                {sec.heroTitle}
              </h1>
              <p className="text-white/90 text-xs sm:text-[13px] lg:text-[14px] leading-relaxed font-normal drop-shadow-sm tracking-normal">
                {sec.description}
              </p>
            </div>

            {/* ====================================================
                CENTER: CONDENSED ANTON LETTERS TIGHTLY FRAMING BOWL
                Scaled to hug the bowl closely without colliding with left text
                ==================================================== */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none overflow-hidden">
              <div className="relative flex items-center justify-center">
                {/* Left Word Segment */}
                <span
                  className="text-[18vw] sm:text-[15vw] md:text-[13vw] lg:text-[130px] xl:text-[155px] font-normal uppercase leading-none text-white drop-shadow-[0_20px_45px_rgba(0,0,0,0.38)] -mr-5 sm:-mr-8 lg:-mr-10"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: '0.01em',
                  }}
                >
                  {sec.firstWord}
                </span>

                {/* Center Spacer: sized to match the circular bowl */}
                <div className="w-[46vw] sm:w-[40vw] md:w-[34vw] lg:w-[28vw] xl:w-[26vw] max-w-[370px] aspect-square shrink-0 pointer-events-none" />

                {/* Right Word Segment */}
                <span
                  className="text-[18vw] sm:text-[15vw] md:text-[13vw] lg:text-[130px] xl:text-[155px] font-normal uppercase leading-none text-white drop-shadow-[0_20px_45px_rgba(0,0,0,0.38)] -ml-5 sm:-ml-8 lg:-ml-10"
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
                Drops down with gravity when advancing to Section 2
                ==================================================== */}
            <div
              ref={(el) => (bowlRefs.current[idx] = el)}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 will-change-transform"
            >
              <div
                onClick={() => {
                  if (idx === SECTIONS.length - 1) {
                    dropToNextSection();
                  } else {
                    goToSlide(idx + 1);
                  }
                }}
                className="group cursor-pointer pointer-events-auto will-change-transform transition-transform hover:scale-105 active:scale-95 duration-300"
                title={
                  idx === SECTIONS.length - 1
                    ? 'Click to drop into the molten chocolate pour'
                    : 'Click to explore next flavor'
                }
              >
                {/* Enhanced Radial Glow behind circular bowl */}
                <div
                  className="absolute -inset-8 rounded-full blur-3xl opacity-50 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${sec.color} 0%, transparent 70%)`,
                  }}
                />

                <div className="w-[52vw] sm:w-[44vw] md:w-[40vw] lg:w-[36vw] xl:w-[34vw] max-w-[390px] aspect-square rounded-full overflow-hidden shadow-[0_40px_90px_rgba(0,0,0,0.85)] filter select-none">
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
