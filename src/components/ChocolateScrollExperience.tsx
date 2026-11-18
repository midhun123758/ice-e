import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';

interface ChocolateScrollExperienceProps {
  currentFlavor?: {
    id: string;
    name: string;
    color: string;
    gradientStops: [string, string];
    notes: string[];
    description: string;
  };
  isActive?: boolean;
  isAutoPlay?: boolean;
  scrollProgress?: number;
  onComplete?: () => void;
  onRewindToStart?: () => void;
}

// 58 High-Resolution Lossless PNG Frames (000 to 057)
const TOTAL_FRAMES = 58;

// Pure artisanal Belgian Chocolate Pouring Theme
const THEME = {
  title: '#241005', // Deep Belgian dark chocolate
  eyebrow: '#512A1C',
  dot: '#512A1C',
  body: 'rgba(57, 29, 18, 0.92)',
  notes: 'rgba(81, 42, 28, 0.85)',
};

export function ChocolateScrollExperience({
  isActive = true,
  isAutoPlay = false,
  scrollProgress,
  onComplete,
  onRewindToStart,
}: ChocolateScrollExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const velocityRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const scrollDirectionRef = useRef(0);
  const CRUISING_SPEED = 0.85; // Faster, ultra-responsive silky pour (~1.1s full pour)
  const SCROLL_ACTIVE_TIMEOUT = 280; // Crisp active window for fluid continuous frame delivery
  const lastDrawnFrameRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);
  const isCooldownRef = useRef(false);
  const endOverscrollRef = useRef(0);
  const startOverscrollRef = useRef(0);
  const [displayFrame, setDisplayFrame] = useState(0);

  const getFrameUrl = (index: number) => {
    const numStr = String(index).padStart(3, '0');
    return `/frames/Chocolate_pouring_over_ice_cream_9be1800c_1080p_${numStr}.png`;
  };

  // Progressive frame loader: Load frame 0 instantly, then stream remaining frames when near viewport
  const isLoadedNearRef = useRef(false);

  const preloadRemainingFrames = () => {
    if (isLoadedNearRef.current) return;
    isLoadedNearRef.current = true;

    // Load in chunks to prevent network choking
    let i = 1;
    const loadNextBatch = () => {
      const limit = Math.min(TOTAL_FRAMES, i + 8);
      for (; i < limit; i++) {
        if (!imagesRef.current[i]) {
          const img = new Image();
          img.src = getFrameUrl(i);
          imagesRef.current[i] = img;
        }
      }
      if (i < TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadNextBatch);
        } else {
          setTimeout(loadNextBatch, 50);
        }
      }
    };
    loadNextBatch();
  };

  // Preload frame 0 immediately, and watch for viewport proximity
  useEffect(() => {
    currentFrameRef.current = 0;
    velocityRef.current = 0;
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
    imagesRef.current = [poster];

    // If already active or scroll progress active, preload all
    if (isActive || scrollProgress !== undefined) {
      preloadRemainingFrames();
    }

    // IntersectionObserver to preload frames just before user scrolls into Section 2
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
      { rootMargin: '600px 0px' }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Frame rendering on native 1920x1080 canvas
  const lastStateFrameRef = useRef(0);
  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    // Optimized state update: Only update React state when crossing key thresholds to eliminate UI stutter
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
      }, 500);
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
    currentFrameRef.current = targetFrame;
    renderFrame(targetFrame);
  }, [scrollProgress]);

  // On-demand silky smooth liquid inertia animation loop (stops when idle to eliminate CPU drain)
  const isLoopRunningRef = useRef(false);

  const startLoop = () => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const updateLoop = () => {
      const now = performance.now();
      const isActivelyScrolling = now - lastScrollTimeRef.current < SCROLL_ACTIVE_TIMEOUT;

      if (isActivelyScrolling && scrollDirectionRef.current !== 0) {
        const targetVelocity = CRUISING_SPEED * scrollDirectionRef.current;
        velocityRef.current += (targetVelocity - velocityRef.current) * 0.24;
      } else {
        velocityRef.current += (0 - velocityRef.current) * 0.16;
      }

      if (Math.abs(velocityRef.current) > 0.002) {
        currentFrameRef.current += velocityRef.current;

        if (currentFrameRef.current <= 0) {
          currentFrameRef.current = 0;
          velocityRef.current = 0;
        } else if (currentFrameRef.current >= TOTAL_FRAMES - 1) {
          currentFrameRef.current = TOTAL_FRAMES - 1;
          velocityRef.current = 0;
        }

        renderFrame(currentFrameRef.current);
        rafIdRef.current = requestAnimationFrame(updateLoop);
      } else {
        velocityRef.current = 0;
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
    const speed = 0.58; // Fast, silky molten enrobe (~1.6 seconds)

    const autoStep = () => {
      if (currentFrameRef.current < TOTAL_FRAMES - 1) {
        currentFrameRef.current = Math.min(TOTAL_FRAMES - 1, currentFrameRef.current + speed);
        renderFrame(currentFrameRef.current);
        autoRaf = requestAnimationFrame(autoStep);
      } else {
        // Molten enrobing completed! Brief pause to admire the shell, then advance
        completeTimeout = setTimeout(() => {
          onComplete?.();
        }, 700);
      }
    };

    // Small initial delay so card modal settles into view before pouring begins
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
      startLoop();

      const current = currentFrameRef.current;

      if (e.deltaY > 0) {
        // Scrolling DOWN: Advance the molten pouring animation
        startOverscrollRef.current = 0;

        if (current < TOTAL_FRAMES - 1) {
          scrollDirectionRef.current = 1;
          lastScrollTimeRef.current = performance.now();
          currentFrameRef.current = Math.min(
            TOTAL_FRAMES - 1,
            currentFrameRef.current + Math.min(2.0, Math.max(0.4, Math.abs(e.deltaY) * 0.015))
          );
          renderFrame(currentFrameRef.current);
        } else {
          // Firmly stop on the final image! Do not scroll away.
          currentFrameRef.current = TOTAL_FRAMES - 1;
          velocityRef.current = 0;
          renderFrame(TOTAL_FRAMES - 1);

          // Deliberate extra downward scrolling continues to Flavors
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
      } else if (e.deltaY < 0) {
        // Scrolling UP: Rewind/unpour the chocolate
        endOverscrollRef.current = 0;

        if (current > 0.4) {
          scrollDirectionRef.current = -1;
          lastScrollTimeRef.current = performance.now();
          currentFrameRef.current = Math.max(
            0,
            currentFrameRef.current - Math.min(2.0, Math.max(0.4, Math.abs(e.deltaY) * 0.015))
          );
          renderFrame(currentFrameRef.current);
        } else {
          // Firmly stop at frame 0
          currentFrameRef.current = 0;
          velocityRef.current = 0;
          renderFrame(0);

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
      startLoop();

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;

      const current = currentFrameRef.current;

      if (deltaY > 2) {
        startOverscrollRef.current = 0;
        if (current < TOTAL_FRAMES - 1) {
          scrollDirectionRef.current = 1;
          lastScrollTimeRef.current = performance.now();
          currentFrameRef.current = Math.min(
            TOTAL_FRAMES - 1,
            currentFrameRef.current + Math.min(2.2, deltaY * 0.08)
          );
          renderFrame(currentFrameRef.current);
        } else {
          // Firmly stop on the final image
          currentFrameRef.current = TOTAL_FRAMES - 1;
          velocityRef.current = 0;
          renderFrame(TOTAL_FRAMES - 1);

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
      } else if (deltaY < -2) {
        endOverscrollRef.current = 0;
        if (current > 0.4) {
          scrollDirectionRef.current = -1;
          lastScrollTimeRef.current = performance.now();
          currentFrameRef.current = Math.max(
            0,
            currentFrameRef.current - Math.min(2.2, Math.abs(deltaY) * 0.08)
          );
          renderFrame(currentFrameRef.current);
        } else {
          currentFrameRef.current = 0;
          velocityRef.current = 0;
          renderFrame(0);

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
