import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';

interface ChocolateScrollExperienceProps {
  isActive?: boolean;
  isAutoPlay?: boolean;
  scrollProgress?: number;
  onComplete?: () => void;
  onRewindToStart?: () => void;
}

const TOTAL_FRAMES = 58;

const THEME = {
  eyebrow: '#5C3826', // Warm artisanal cacao
  title: '#241005', // Deep Belgian dark chocolate
  body: '#3A2012', // Rich melted chocolate
  notes: '#6D4430', // Milk chocolate highlight
  dot: '#3D1C06',
};

export function ChocolateScrollExperience({
  isActive = false,
  isAutoPlay = false,
  scrollProgress,
  onComplete,
  onRewindToStart,
}: ChocolateScrollExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef(false);
  const isCooldownRef = useRef(false);
  const endOverscrollRef = useRef(0);
  const startOverscrollRef = useRef(0);
  const [displayFrame, setDisplayFrame] = useState(0);

  const getFrameUrl = (index: number) => {
    const numStr = String(index).padStart(3, '0');
    return `/frames/Chocolate_pouring_over_ice_cream_9be1800c_1080p_${numStr}.png`;
  };

  // Eager preloader for all 58 frames
  const isLoadedNearRef = useRef(false);

  const preloadRemainingFrames = () => {
    if (isLoadedNearRef.current) return;
    isLoadedNearRef.current = true;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!imagesRef.current[i]) {
        const img = new Image();
        img.src = getFrameUrl(i);
        imagesRef.current[i] = img;
      }
    }
  };

  // Preload frame 0 immediately, and eagerly preload all frames
  useEffect(() => {
    currentFrameRef.current = 0;
    targetFrameRef.current = 0;
    lastDrawnFrameRef.current = -1;
    isLoadedNearRef.current = false;

    // Load initial poster frame 0
    const poster = new Image();
    poster.src = getFrameUrl(0);
    poster.onload = () => {
      if (lastDrawnFrameRef.current === -1) {
        renderFrame(0);
      }
    };
    imagesRef.current[0] = poster;

    preloadRemainingFrames();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preloadRemainingFrames();
          }
        });
      },
      { rootMargin: '800px 0px' }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Frame rendering on native 1920x1080 canvas with high-quality smoothing
  const lastStateFrameRef = useRef(0);
  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const clampedIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIndex)));

    // Avoid redundant repaints if already on this exact frame
    if (clampedIndex === lastDrawnFrameRef.current) return;

    let img = imagesRef.current[clampedIndex];

    if (!img || !img.complete || img.naturalWidth === 0) {
      const fallbackImg = imagesRef.current[lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0];
      if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth > 0) {
        img = fallbackImg;
      } else {
        return;
      }
    }

    ctx.drawImage(img, 0, 0, 1920, 1080);
    lastDrawnFrameRef.current = clampedIndex;

    const isBoundary = clampedIndex === 0 || clampedIndex >= TOTAL_FRAMES - 2;
    const isMajorStep = Math.abs(clampedIndex - lastStateFrameRef.current) >= 4;

    if (isBoundary || isMajorStep) {
      lastStateFrameRef.current = clampedIndex;
      setDisplayFrame(clampedIndex);
    }
  };

  // Reset or initialize frame when section becomes active
  useEffect(() => {
    if (isActive) {
      isCooldownRef.current = true;
      endOverscrollRef.current = 0;
      startOverscrollRef.current = 0;
      setTimeout(() => {
        isCooldownRef.current = false;
      }, 450);
      renderFrame(currentFrameRef.current);
    }
  }, [isActive]);

  // Synchronize frame with smooth page scroll progress if provided
  useEffect(() => {
    if (scrollProgress === undefined) return;
    const targetFrame = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(scrollProgress * (TOTAL_FRAMES - 1)))
    );
    targetFrameRef.current = targetFrame;
    startLoop();
  }, [scrollProgress]);

  // Luxury Viscous Liquid Inertia Loop (Lerp Interpolation)
  const startLoop = () => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const LERP_SPEED = 0.14; // Weighted liquid physics

    const updateLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.008) {
        currentFrameRef.current += diff * LERP_SPEED;
        renderFrame(currentFrameRef.current);
        rafIdRef.current = requestAnimationFrame(updateLoop);
      } else {
        currentFrameRef.current = targetFrameRef.current;
        renderFrame(currentFrameRef.current);
        isLoopRunningRef.current = false;
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    if (isActive) {
      startLoop();
    }
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      isLoopRunningRef.current = false;
    };
  }, [isActive]);

  // Auto-Play: Smoothly pours and cascades chocolate across 58 frames
  useEffect(() => {
    if (!isActive || !isAutoPlay) return;

    let autoRaf: number;
    let completeTimeout: ReturnType<typeof setTimeout>;
    const speed = 0.55;

    const autoStep = () => {
      if (targetFrameRef.current < TOTAL_FRAMES - 1) {
        targetFrameRef.current = Math.min(TOTAL_FRAMES - 1, targetFrameRef.current + speed);
        startLoop();
        autoRaf = requestAnimationFrame(autoStep);
      } else {
        completeTimeout = setTimeout(() => {
          onComplete?.();
        }, 800);
      }
    };

    const startDelay = setTimeout(() => {
      autoRaf = requestAnimationFrame(autoStep);
    }, 300);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(completeTimeout);
      if (autoRaf) cancelAnimationFrame(autoRaf);
    };
  }, [isActive, isAutoPlay, onComplete]);

  // Wheel and Touch listeners: Active when Section 2 is locked/active on screen
  useEffect(() => {
    if (!isActive) return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isCooldownRef.current) return;

      const delta = e.deltaY;
      const SENSITIVITY = 0.045; // Silky fluid control rate

      if (delta > 0) {
        startOverscrollRef.current = 0;

        if (targetFrameRef.current < TOTAL_FRAMES - 1) {
          targetFrameRef.current = Math.min(
            TOTAL_FRAMES - 1,
            targetFrameRef.current + Math.min(3.0, Math.max(0.5, Math.abs(delta) * SENSITIVITY))
          );
          startLoop();
        } else {
          endOverscrollRef.current += 1;
          if (endOverscrollRef.current >= 4) {
            isCooldownRef.current = true;
            onComplete?.();
            setTimeout(() => {
              isCooldownRef.current = false;
              endOverscrollRef.current = 0;
            }, 800);
          }
        }
      } else if (delta < 0) {
        endOverscrollRef.current = 0;

        if (targetFrameRef.current > 0) {
          targetFrameRef.current = Math.max(
            0,
            targetFrameRef.current - Math.min(3.0, Math.max(0.5, Math.abs(delta) * SENSITIVITY))
          );
          startLoop();
        } else {
          startOverscrollRef.current += 1;
          if (startOverscrollRef.current >= 4) {
            isCooldownRef.current = true;
            onRewindToStart?.();
            setTimeout(() => {
              isCooldownRef.current = false;
              startOverscrollRef.current = 0;
            }, 800);
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (isCooldownRef.current) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;

      if (deltaY > 1.5) {
        startOverscrollRef.current = 0;
        if (targetFrameRef.current < TOTAL_FRAMES - 1) {
          targetFrameRef.current = Math.min(
            TOTAL_FRAMES - 1,
            targetFrameRef.current + Math.min(2.5, Math.abs(deltaY) * 0.08)
          );
          startLoop();
        } else {
          endOverscrollRef.current += 1;
          if (endOverscrollRef.current >= 4) {
            isCooldownRef.current = true;
            onComplete?.();
            setTimeout(() => {
              isCooldownRef.current = false;
              endOverscrollRef.current = 0;
            }, 800);
          }
        }
      } else if (deltaY < -1.5) {
        endOverscrollRef.current = 0;
        if (targetFrameRef.current > 0) {
          targetFrameRef.current = Math.max(
            0,
            targetFrameRef.current - Math.min(2.5, Math.abs(deltaY) * 0.08)
          );
          startLoop();
        } else {
          startOverscrollRef.current += 1;
          if (startOverscrollRef.current >= 4) {
            isCooldownRef.current = true;
            onRewindToStart?.();
            setTimeout(() => {
              isCooldownRef.current = false;
              startOverscrollRef.current = 0;
            }, 800);
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
  }, [isActive, onComplete, onRewindToStart]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#D2D7D4] flex items-center justify-center select-none">
      {/* 100% Pure, Edge-to-Edge 1080p Canvas */}
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Side "About" Description: Large Editorial Typography (No box) */}
      <aside
        className={`absolute left-8 sm:left-14 lg:left-24 top-1/2 -translate-y-1/2 z-20 max-w-lg lg:max-w-2xl pointer-events-none transition-all duration-700 ease-out ${
          isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}
      >
        <div className="flex flex-col items-start select-text">
          {/* Eyebrow Tag */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: THEME.dot }}
            />
            <span
              className="text-sm sm:text-base font-bold uppercase tracking-widest"
              style={{
                fontFamily: "'Fredoka', cursive, sans-serif",
                color: THEME.eyebrow,
              }}
            >
              About The Pour
            </span>
          </div>

          {/* Large Title in Fredoka Bold Font */}
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.04] mb-5 drop-shadow-sm select-none"
            style={{
              fontFamily: "'Fredoka', cursive, sans-serif",
              color: THEME.title,
            }}
          >
            The Molten Enrobing
          </h2>

          {/* Description in larger font */}
          <p
            className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium mb-6 drop-shadow-sm"
            style={{ color: THEME.body }}
          >
            Pure double-churned Hokkaido milk soft-serve slowly enrobed in molten Belgian dark chocolate. Warm at the moment of cascade, the fudge crystallization sets into a delicate crisp shell with a rich, velvety core.
          </p>

          {/* Subtle Craft Notes */}
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm sm:text-base font-semibold mb-4"
            style={{ color: THEME.notes }}
          >
            <span>70% Single-Origin Cocoa</span>
            <span>•</span>
            <span>-7°C Hokkaido Churn</span>
            <span>•</span>
            <span>Crisp Molten Shell</span>
          </div>

          {/* Clean Action Button when stopped at the final frame */}
          {displayFrame >= TOTAL_FRAMES - 2 && onComplete && (
            <button
              onClick={onComplete}
              className="mt-2 pointer-events-auto inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-stone-900 font-bold text-sm uppercase tracking-wider shadow-2xl hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>Explore Flavors</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

export default ChocolateScrollExperience;
